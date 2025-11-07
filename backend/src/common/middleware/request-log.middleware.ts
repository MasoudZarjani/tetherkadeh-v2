import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { MetricsService } from 'src/metrics.service';

@Injectable()
export class RequestLogService implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    private readonly metricsService: MetricsService,
  ) {}

  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const { method, url, ip } = req;
    const start = Date.now();

    const finishHandler = () => {
      const duration = Date.now() - start;
      const status = res.statusCode || 200;

      this.logger.log(
        `${method} ${url} [${status}] - ${duration}ms - IP: ${ip}`,
        'RequestLogger',
      );

      this.logger.logRequest(method, url, status, duration, ip as string);

      // Optional metrics
      this.metricsService.incrementRequest(url, method, status.toString());
    };

    // ✅ امن‌ترین روش: چک کن res.raw وجود داره و EventEmitter هست
    const rawRes = (res as any)?.raw;
    if (rawRes && typeof rawRes.on === 'function') {
      rawRes.on('finish', finishHandler);
      rawRes.on('close', finishHandler);
    } else {
      // اگر raw وجود نداشت (خیلی نادر)، فقط بعد از next لاگ کن
      process.nextTick(finishHandler);
    }

    next();
  }
}
