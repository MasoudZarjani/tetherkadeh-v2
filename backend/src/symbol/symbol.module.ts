import { Module } from '@nestjs/common';
import { SymbolService } from './symbol.service';
import { SymbolController } from './symbol.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SymbolSchema } from './entities/symbol.entity';
import { AdminModule } from 'src/admin/admin.module';
import { NetworkModule } from 'src/network/network.module';
import { HttpModule } from '@nestjs/axios';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Symbol.name, schema: SymbolSchema }]),
    AdminModule,
    NetworkModule,
    HttpModule,
    SettingModule,
  ],
  controllers: [SymbolController],
  providers: [SymbolService],
  exports: [SymbolService],
})
export class SymbolModule {}
