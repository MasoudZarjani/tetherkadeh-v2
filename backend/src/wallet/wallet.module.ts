import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { SymbolModule } from 'src/symbol/symbol.module';
import { NetworkModule } from 'src/network/network.module';
import { BankAccountModule } from 'src/bank-account/bank-account.module';
import { RequestContextService } from 'src/common/services/request-context.service';
import { SettingModule } from 'src/setting/setting.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MessageModule,
    UserModule,
    AdminModule,
    SymbolModule,
    NetworkModule,
    BankAccountModule,
    SettingModule,
  ],
  controllers: [WalletController],
  providers: [WalletService, RequestContextService, JwtService],
  exports: [WalletService],
})
export class WalletModule {}
