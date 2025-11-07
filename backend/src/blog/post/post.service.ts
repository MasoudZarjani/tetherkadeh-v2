import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Cache } from 'cache-manager';
import { ListPostDto } from '../dto/list-post.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    let slug = slugify(createPostDto.title);
    const exists = await this.postModel.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const post = new this.postModel({
      ...createPostDto,
      slug,
      publishedAt: createPostDto.published ? new Date() : null,
    });
    return post.save();
  }

  async findAll(listPostDto: ListPostDto): Promise<any> {
    try {
      const { page = 1, limit = 10, category, tag, search } = listPostDto;
      const filter: any = { published: true };

      if (category) filter['category'] = category;
      if (tag) filter['tags'] = tag;
      if (search) filter['title'] = new RegExp(search, 'i');

      const posts = await this.postModel
        .find(filter)
        .populate('category')
        .populate('tags')
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(+limit);

      const total = await this.postModel.countDocuments(filter);
      return { items: posts, total, page: +page, limit: +limit };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel
      .findById(id)
      .populate('category')
      .populate('tags')
      .exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    // Invalidate caches
    await this.cacheManager.del('all_posts');
    return updatedPost;
  }

  async remove(id: string): Promise<any> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    // Invalidate caches
    await this.cacheManager.del('all_posts');
    return { message: 'Post deleted successfully' };
  }
}
