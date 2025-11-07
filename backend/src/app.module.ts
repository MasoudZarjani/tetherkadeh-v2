import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { SymbolModule } from './symbol/symbol.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BankAccountModule } from './bank-account/bank-account.module';
import { WalletModule } from './wallet/wallet.module';
import { NetworkModule } from './network/network.module';
import { TaskService } from './task/task.service';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { OrderModule } from './order/order.module';
import { JibitModule } from './helpers/jibit/jibit.module';
import { CacheModule } from '@nestjs/cache-manager';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { join } from 'path';
import { SettingModule } from './setting/setting.module';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { PriceHistoryModule } from './price-history/price-history.module';
import { BlogModule } from './blog/blog.module';
import { JwtService } from '@nestjs/jwt';
import { HealthModule } from './health/health.module';
import { LoggerService } from './common/logger/logger.service';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { RequestLogService } from './common/middleware/request-log.middleware';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 40,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: () => {
        const options: MongooseModuleOptions = {
          uri: process.env.MONGODB_DB_URI,
        };
        return options;
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ lruSize: 5000 }),
            }),
            createKeyv(
              `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            ),
          ],
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'fa', // Default language
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        // 1. Check query parameter (?lang=en)
        { use: QueryResolver, options: ['lang'] },
        // 2. Check Accept-Language header
        new AcceptLanguageResolver(),
        // 3. Check custom header (x-lang)
        new HeaderResolver(['x-lang']),
      ],
    }),
    ScheduleModule.forRoot(),
    SettingModule,
    SymbolModule,
    AdminModule,
    MessageModule,
    UserModule,
    BankAccountModule,
    WalletModule,
    NetworkModule,
    OrderModule,
    JibitModule,
    PriceHistoryModule,
    BlogModule,
    HealthModule,
    AnnouncementModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [
    TaskService,
    AppService,
    JwtService,
    MetricsService,
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogService).forRoutes('*');
  }
}
