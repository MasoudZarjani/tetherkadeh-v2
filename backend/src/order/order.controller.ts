import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestContextService } from 'src/common/services/request-context.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards/user.guard';
import { ThrottleGuard } from 'src/common/guards/throttle.guard';
import { RateLimit } from 'src/common/decorators/rate-limit.decorator';
import { ListOrderDto } from './dto/list-order.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AdminRole } from 'src/admin/enums/AdminRole.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly requestContext: RequestContextService,
  ) {}

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard, ThrottleGuard)
  @RateLimit(5, 60)
  @Post()
  create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
    const context = this.requestContext.getRequestContext(req);
    return this.orderService.create(createOrderDto, context);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(UserGuard)
  @Get()
  findAll(@Req() req: any, @Query() listOrderDto: ListOrderDto) {
    const context = this.requestContext.getRequestContext(req);
    listOrderDto.userId = context.user._id;
    return this.orderService.findAll(listOrderDto);
  }

  @ApiBearerAuth('Authorization')
  @UseGuards(AdminGuard)
  @Roles(AdminRole.Admin, AdminRole.Moderator, AdminRole.Support)
  @Get('admin')
  findAllAdmin(@Query() listOrderDto: ListOrderDto) {
    return this.orderService.findAll(listOrderDto);
  }
}
