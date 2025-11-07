import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  HttpStatus,
  Redirect,
  Param,
  Res,
  Put,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ChargeWalletDto } from './dto/charge-wallet.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { UserGuard } from 'src/common/guards/user.guard';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';
import { VerifyWithdrawDto } from './dto/verify-withdraw.dto';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { DepositRequestDto } from './dto/deposit-request.dto';
import { TransactionDto } from './dto/transaction.dto';
import { RequestContextService } from 'src/common/services/request-context.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { ListWalletAdminDto } from './dto/list-wallet-admin.dto';
import { ChangeStatusWalletDto } from './dto/change-status-wallet.dto';

@Controller('api/v1/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly requestContext: RequestContextService,
  ) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Post()
  create(@Req() req: any, @Body() chargeWalletDto: ChargeWalletDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.create(chargeWalletDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('inventory')
  inventory(@Req() req: any) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.inventory(context.user._id);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('withdraw')
  withdraw(@Req() req: any, @Body() withdrawRequestDto: WithdrawRequestDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.withdraw(withdrawRequestDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('payment')
  payment(@Req() req: any, @Body() paymentRequestDto: PaymentRequestDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.payment(paymentRequestDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('deposit')
  deposit(@Req() req: any, @Body() depositRequestDto: DepositRequestDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.deposit(depositRequestDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('verify-withdraw')
  verifyWithdraw(
    @Req() req: any,
    @Body() verifyWithdrawDto: VerifyWithdrawDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.verifyWithdraw(verifyWithdrawDto, context);
  }

  @Get('verify-payment')
  async verifyPayment(
    @Query() verifyPaymentDto: VerifyPaymentDto,
    @Res() res: any,
  ) {
    const resp = await this.walletService.verifyPayment(verifyPaymentDto);
    const url = `${resp.frontUrl}/dashboard/wallet/deposit/callback?success=${resp.success}&token=${resp.token}`;
    return res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('transactions')
  transactions(@Req() req: any, @Query() transactionDto: TransactionDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.transactions(transactionDto, context.user._id);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin/:userId')
  availableAmount(@Param('userId') userId: string) {
    return this.walletService.inventory(userId);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin/list')
  findAllAdmin(@Query() listWalletAdminDto: ListWalletAdminDto) {
    return this.walletService.findAll(listWalletAdminDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Put('admin/change-status')
  changeStatus(
    @Req() req: any,
    @Body() changeStatusWalletDto: ChangeStatusWalletDto,
  ) {
    const context = this.requestContext.getRequestContext(req);
    return this.walletService.changeStatus(changeStatusWalletDto, context);
  }
}
