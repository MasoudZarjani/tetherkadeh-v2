import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { Category, CategorySchema } from './entities/category.entity';
import { Tag, TagSchema } from './entities/tag.entity';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { TagService } from './tag/tag.service';
import { TagController } from './tag/tag.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
    ]),
    AdminModule,
    CacheModule.register(), // Using in-memory cache for simplicity
  ],
  controllers: [PostController, CategoryController, TagController],
  providers: [PostService, CategoryService, TagService],
})
export class BlogModule {}
