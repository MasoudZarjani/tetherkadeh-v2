import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Referral, ReferralSchema } from './entities/referral.entity';
import { MessageModule } from 'src/message/message.module';
import { Level, LevelSchema } from './entities/level.entity';
import { JibitModule } from 'src/helpers/jibit/jibit.module';
import { RequestContextService } from 'src/common/services/request-context.service';
import { UploadModule } from 'src/helpers/upload/upload.module';
import { AdminModule } from 'src/admin/admin.module';
import { SettingModule } from 'src/setting/setting.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Referral.name, schema: ReferralSchema },
      { name: Level.name, schema: LevelSchema },
    ]),
    MessageModule,
    JibitModule,
    UploadModule,
    AdminModule,
    SettingModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, RequestContextService],
  exports: [UserService],
})
export class UserModule {}
