import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ListAnnouncementDto } from './dto/list-announcement.dto';
import { DeleteAnnouncementDto } from './dto/delete-announcement.dto';

@Controller('api/v1/announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Post('admin')
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.announcementService.create(createAnnouncementDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Patch('admin')
  update(@Body() updateAnnouncementDto: UpdateAnnouncementDto) {
    return this.announcementService.update(updateAnnouncementDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin')
  findAllAdmin(@Query() listAnnouncementDto: ListAnnouncementDto) {
    return this.announcementService.findForAdmin(listAnnouncementDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Delete('admin')
  delete(@Param() deleteAnnouncementDto: DeleteAnnouncementDto) {
    return this.announcementService.delete(deleteAnnouncementDto);
  }

  @Get()
  findAll() {
    return this.announcementService.findAll();
  }
}
