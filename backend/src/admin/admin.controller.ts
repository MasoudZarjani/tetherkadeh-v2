import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChangeStatusAdminDto, UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ListAdminDto } from './dto/list-admin.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AdminRole } from './enums/AdminRole.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('register')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator)
  @Get()
  findAll(@Query() listAdminDto: ListAdminDto) {
    return this.adminService.findAll(listAdminDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user._doc;
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

   @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator)
  @Patch('change-status/:id')
  changeStatus(@Param('id') id: string, @Body() changeStatusAdminDto: ChangeStatusAdminDto) {
    return this.adminService.changeStatus(id, changeStatusAdminDto);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Post('upload')
  async upload(@Req() req: FastifyRequest) {
    const parts = req.parts();
    for await (const part of parts) {
      return this.adminService.upload(part);
    }
  }
}
