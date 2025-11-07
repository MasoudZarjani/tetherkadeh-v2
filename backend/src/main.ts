import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart from '@fastify/multipart';
import helmet from '@fastify/helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import './instrument';

async function bootstrap() {
  const customLogger = new LoggerService();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: customLogger },
  );

  const CORS_OPTIONS = {
    origin: '*',
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'PATCH'],
  };
  app.enableCors(CORS_OPTIONS);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
        scriptSrc: ["'self'", 'code.jquery.com'],
      },
    },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: false,
    global: true,
  });

  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });

  app.register(fastifyMultipart, { limits: { fileSize: 2 * 1024 * 1024 } });

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: ` Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'Authorization',
    )
    .setExternalDoc('Postman Collection', '/api-json')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const i18n = app.get<I18nService>(I18nService);
  app.useGlobalFilters(new AllExceptionsFilter(i18n, customLogger));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(customLogger));

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  customLogger.log(
    `🚀 Server is listening on port ${process.env.PORT}`,
    'Bootstrap',
  );
}
bootstrap();
