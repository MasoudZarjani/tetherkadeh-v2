import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from '../entities/tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import { ListTagDto } from '../dto/list-tag.dto';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const newTag = new this.tagModel(createTagDto);
    return newTag.save();
  }

  async findAll(listTagDto: ListTagDto): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
      } = listTagDto;
      const skip = (page - 1) * limit;
      let query = {};
      if (search) {
        const regex = new RegExp(search, 'i'); // i برای case-insensitive
        query = {
          $or: [{ name: regex }, { slug: regex }],
        };
      }
      const sortObj: Record<string, 1 | -1> = {
        [sort]: order === -1 ? -1 : 1,
      };
      const [data, total] = await Promise.all([
        this.tagModel.find(query).sort(sortObj).skip(skip).limit(limit).exec(),
        this.tagModel.countDocuments(query).exec(),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagModel.findById(id).exec();
    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return tag;
  }
}
