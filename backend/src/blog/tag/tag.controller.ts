import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from '../dto/create-tag.dto';
import { ListTagDto } from '../dto/list-tag.dto';

@Controller('api/v1/blog/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(@Query() listTagDto: ListTagDto) {
    return this.tagService.findAll(listTagDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }
}
