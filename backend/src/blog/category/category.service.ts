import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ListCategoryDto } from '../dto/list-category.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = slugify(createCategoryDto.name);
    const newCategory = new this.categoryModel({ ...createCategoryDto, slug });
    return await newCategory.save();
  }

  async findAll(listCategoryDto: ListCategoryDto): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
      } = listCategoryDto;
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
        this.categoryModel
          .find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.categoryModel.countDocuments(query).exec(),
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

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`دسته بندی با شناسه "${id}" پیدا نشد`);
    }
    return category;
  }
}
