import {
  Injectable,
  LoggerService as NestLoggerService,
  LogLevel,
} from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    // 📂 مسیر فایل‌های جداگانه برای هر نوع لاگ
    const transports = [
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'requests.log'),
        level: 'http',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'database.log'),
        level: 'verbose',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'performance.log'),
        level: 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),

      // 🖥️ لاگ رنگی در Console
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ level, message, context, timestamp }) => {
            return `[${timestamp}] ${level} ${context ? `[${context}]` : ''} ${message}`;
          }),
        ),
      }),
    ];

    this.logger = winston.createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
      },
      transports,
    });
  }

  // 🧩 متدهای عمومی
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  http(message: string, context?: string) {
    this.logger.log('http', message, { context });
  }

  // 🧠 متدهای سفارشی برای سطوح خاص
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    ip: string,
  ) {
    this.logger.http(
      `${method} ${url} [${statusCode}] ${duration}ms - IP:${ip}`,
      { context: 'HTTP' },
    );
  }

  logDatabase(query: string, duration?: number) {
    this.logger.verbose(
      `Query: ${query} ${duration ? `(${duration}ms)` : ''}`,
      {
        context: 'Database',
      },
    );
  }

  logPerformance(action: string, duration: number, context?: string) {
    this.logger.debug(`${action} took ${duration}ms`, {
      context: context || 'Performance',
    });
  }

  setLogLevels(levels: LogLevel[]) {
    this.logger.level = levels[0];
  }
}
