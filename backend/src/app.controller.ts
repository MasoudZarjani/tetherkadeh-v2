import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from './common/guards/user.guard';
import { AdminGuard } from './common/guards/admin.guard';
import { Roles } from './common/decorators/roles.decorator';
import { AdminRole } from './admin/enums/AdminRole.enum';

@Controller('api/v1')
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('dashboard')
  dashboard(@Req() req: any) {
    let user = req.user;
    return this.appService.dashboard(user);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support, AdminRole.Seo)
  @Get('admin/dashboard')
  adminDashboard() {
    return this.appService.adminDashboard();
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('transaction')
  transaction(@Req() req: any) {
    let user = req.user;
    return this.appService.transaction(user);
  }
}
