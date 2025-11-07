import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { AdminModule } from 'src/admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './entities/setting.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    AdminModule,
  ],
  controllers: [SettingController],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
