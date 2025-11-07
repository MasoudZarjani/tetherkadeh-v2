import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './entities/order.entity';
import { SymbolModule } from 'src/symbol/symbol.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { RequestContextService } from 'src/common/services/request-context.service';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    SymbolModule,
    WalletModule,
    UserModule,
    AdminModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, RequestContextService, JwtService],
  exports: [OrderService],
})
export class OrderModule {}
