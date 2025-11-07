import { Injectable } from '@nestjs/common';
import { Counter, Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly requestsCounter: Counter<string>;

  constructor() {
    this.registry = new Registry();

    // متریک‌های پیش‌فرض Node.js
    collectDefaultMetrics({ register: this.registry });

    // شمارنده HTTP
    this.requestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.registry.registerMetric(this.requestsCounter);
  }

  incrementRequest(route: string, method: string, status: string) {
    this.requestsCounter.inc({ route, method, status });
  }

  getMetricsRegistry() {
    return this.registry;
  }
}
