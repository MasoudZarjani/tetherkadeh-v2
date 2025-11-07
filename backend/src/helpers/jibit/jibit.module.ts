import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JibitService } from './jibit.service';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    HttpModule, // To make HttpService available for JibitService
    SettingModule,
  ],
  providers: [JibitService],
  exports: [JibitService], // Export JibitService so it can be imported by other modules
})
export class JibitModule {}
