import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { RequestContextService } from 'src/common/services/request-context.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { ListBankAccountDto } from './dto/list-bank-account.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';

@Controller('api/v1/bank-account')
export class BankAccountController {
  constructor(
    private readonly bankAccountService: BankAccountService,
    private readonly requestContext: RequestContextService,
  ) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post('add')
  add(@Req() req: any, @Body() createBankAccountDto: CreateBankAccountDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.bankAccountService.add(createBankAccountDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get('user')
  findAllByUser(@Req() req: any) {
    let user = req.user;
    return this.bankAccountService.findAllByUser(user._id);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin/:userId')
  findByAdmin(
    @Param('userId') userId: string,
    @Query() listBankAccountDto: ListBankAccountDto,
  ) {
    return this.bankAccountService.findByAdmin(userId, listBankAccountDto);
  }
}
