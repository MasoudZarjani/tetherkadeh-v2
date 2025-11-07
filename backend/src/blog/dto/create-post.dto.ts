import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  IsOptional,
  Matches,
  IsBoolean,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'شناسه یافت نشد.' })
  slug: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string; // ID of the category

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  tags: string[]; // Array of tag IDs

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
