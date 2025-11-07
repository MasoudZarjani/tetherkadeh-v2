import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const now = Date.now();

    this.logger.log(`➡️ ${method} ${url} [IP: ${ip}]`, 'Request');

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.log(`⬅️ ${method} ${url} [${ms}ms]`, 'Response');
      }),
    );
  }
}
