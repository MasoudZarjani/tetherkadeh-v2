import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotPasswordDto } from './dto/verify-forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { SetEmailDto } from './dto/set-email.dto';
import { VerifyCodeDto } from './dto/verify-code';
import { SetKycDto } from './dto/set-kyc.dto';
import { ResendUserDto } from './dto/resend-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckToken2FV } from './dto/check-2fv.dto';
import { RequestContextService } from 'src/common/services/request-context.service';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ListUserDto } from './dto/list-user.dto';
import { SetStepDto } from './dto/set-step.dto';
import { ChangeStepUserDto } from './dto/change-step-user.dto';
import { ChangeStatusUserDto } from './dto/change-status-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AddNoteUserDto } from './dto/add-note-user.dto';
import { SetMobileDto } from './dto/set-mobile.dto';

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestContext: RequestContextService,
  ) {}

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('register')
  register(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.register(createUserDto, context);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('confirm')
  confirm(@Req() req: any, @Body() confirmUserDto: ConfirmUserDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.confirm(confirmUserDto, context);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('resend')
  resend(@Req() req: any, @Body() resendUserDto: ResendUserDto) {
    return this.userService.resend(resendUserDto);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('login')
  login(@Req() req: any, @Body() loginUserDto: LoginUserDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.login(loginUserDto, context);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('forgot-password')
  forgotPassword(
    @Req() req: any,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.forgotPassword(forgotPasswordDto, context);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('verify-forgot-password')
  verifyForgotPassword(
    @Req() req: any,
    @Body() verifyForgotPasswordDto: VerifyForgotPasswordDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.verifyForgotPassword(
      verifyForgotPasswordDto,
      context,
    );
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('reset-password')
  resetPassword(@Req() req: any, @Body() resetPasswordDto: ResetPasswordDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.resetPassword(resetPasswordDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('profile')
  profile(@Req() req: any) {
    return req.user;
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('set-email')
  setEmail(@Req() req: any, @Body() setEmailDto: SetEmailDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.setEmail(setEmailDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('set-mobile')
  setMobile(@Req() req: any, @Body() setMobileDto: SetMobileDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.setMobile(setMobileDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('verify-code')
  verifyCode(@Req() req: any, @Body() verifyCodeDto: VerifyCodeDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.verifyCode(verifyCodeDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('upload')
  async upload(@Req() req: any): Promise<any> {
    const parts = req.parts();
    for await (const part of parts) {
      return this.userService.upload(part);
    }
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Put('set-kyc')
  setKyc(@Req() req: any, @Body() setKycDto: SetKycDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.setKyc(setKycDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Put()
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.update(updateUserDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Get('token-2fv')
  getToken2FV(@Req() req: any) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.getToken2FV(context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('token-2fv-check')
  checkToken2FV(@Req() req: any, @Body() checkToken2FV: CheckToken2FV) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.checkToken2FV(checkToken2FV, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin')
  findAll(@Query() listUserDto: ListUserDto) {
    return this.userService.findAll(listUserDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/set-step/:id')
  setStep(
    @Req() req: any,
    @Param('id') id: string,
    @Body() setStepDto: SetStepDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.setStep(id, setStepDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/change-step/:id')
  changeStep(
    @Req() req: any,
    @Param('id') id: string,
    @Body() changeStepUserDto: ChangeStepUserDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.changeStep(id, changeStepUserDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/change-status/:id')
  changeStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() changeStatusUserDto: ChangeStatusUserDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.changeStatus(id, changeStatusUserDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/:id')
  updateAdmin(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateAdminUserDto: UpdateAdminUserDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.updateAdmin(id, updateAdminUserDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/add-note/:id')
  addNoteAdmin(
    @Req() req: any,
    @Param('id') id: string,
    @Body() addNoteUserDto: AddNoteUserDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.userService.addNoteAdmin(id, addNoteUserDto, context);
  }

  @UseGuards(ThrottleGuard)
  @RateLimit(5, 60)
  @Post('google')
  async loginWithGoogle(@Req() req: any, @Body() body: { code: string }) {
    const { code } = body;
    const context = this.requestContext.getRequestContext(req);
    return await this.userService.loginWithGoogle(code, context);
  }
}
