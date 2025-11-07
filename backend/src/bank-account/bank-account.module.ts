import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccount, BankAccountSchema } from './entities/bank-account.entity';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { RequestContextService } from 'src/common/services/request-context.service';
import { JibitModule } from 'src/helpers/jibit/jibit.module';
import { AdminModule } from 'src/admin/admin.module';
import { SettingModule } from 'src/setting/setting.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankAccount.name, schema: BankAccountSchema },
    ]),
    MessageModule,
    UserModule,
    JibitModule,
    AdminModule,
    SettingModule,
  ],
  controllers: [BankAccountController],
  providers: [BankAccountService, RequestContextService, JwtService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
