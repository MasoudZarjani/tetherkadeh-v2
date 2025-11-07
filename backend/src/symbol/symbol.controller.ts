import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SymbolService } from './symbol.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ListSymbolDto } from './dto/list-symbol.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/symbol')
export class SymbolController {
  constructor(private readonly symbolService: SymbolService) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Post()
  create(@Body() createSymbolDto: CreateSymbolDto) {
    return this.symbolService.create(createSymbolDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSymbolDto: UpdateSymbolDto) {
    console.log('test');
    return this.symbolService.update(id, updateSymbolDto);
  }

  @Get()
  findAll() {
    return this.symbolService.findAll();
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin')
  findForAdmin(@Query() listSymbolDto: ListSymbolDto) {
    return this.symbolService.findForAdmin(listSymbolDto);
  }
}
