import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false, default: '' })
  excerpt: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];

  @Prop({ default: false })
  published: boolean;

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop({ required: false, default: '' })
  coverImage: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
