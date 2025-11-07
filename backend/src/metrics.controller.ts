import { Controller, Get, Res, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: FastifyReply) {
    const metrics = await this.metricsService.getMetricsRegistry().metrics();
    res.header(
      'Content-Type',
      this.metricsService.getMetricsRegistry().contentType,
    );
    res.send(metrics);
  }

  // middleware-like route برای افزایش شمارنده
  @Get('hello')
  hello(@Req() req: FastifyRequest): string {
    this.metricsService.incrementRequest(req.url, req.method, '200');
    return 'Hello World!';
  }
}
