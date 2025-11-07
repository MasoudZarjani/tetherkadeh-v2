import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { RATE_LIMIT_KEY } from '../decorators/rate-limit.decorator';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const token = req.headers.authorization?.split(' ')[1];
    let identifier = req.ip;

    if (token) {
      try {
        const decoded: any = await this.jwtService.verifyAsync(token);
        req.user = decoded;
        identifier = decoded.sub;
      } catch (e) {
        // اگر توکن نامعتبر بود، به عنوان anonymous رفتار کن
      }
    }

    const rate = this.reflector.getAllAndOverride<{
      limit: number;
      ttl: number;
    }>(RATE_LIMIT_KEY, [context.getHandler(), context.getClass()]);

    if (rate) {
      const key = `rate:${identifier}:${context.getClass().name}:${context.getHandler().name}`;
      let count = await this.cacheManager.get<number>(key);
      count = count ?? 0;

      if (count >= rate.limit) {
        throw new HttpException(
          'Too Many Requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      await this.cacheManager.set(key, count + 1, rate.ttl * 1000);
    }

    return true;
  }
}
