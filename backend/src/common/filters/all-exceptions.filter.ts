import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { LoggerService } from '../logger/logger.service';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly i18n: I18nService,
    private readonly logger: LoggerService,
  ) {}

  @SentryExceptionCaptured()
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Extract message key from exception
    let messageKey = 'internalServerError';

    if (typeof res === 'string') {
      messageKey = res;
    } else if (typeof res === 'object' && res && 'message' in res) {
      const msg = (res as any).message;
      messageKey = Array.isArray(msg) ? msg[0] : msg;
    }

    // Get language from multiple sources (priority order)
    const lang = this.extractLanguage(request);

    // Translate message
    const localizedMessage = await this.i18n.translate(`errors.${messageKey}`, {
      lang,
    });

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} → ${status} :: ${localizedMessage} [${lang}]`,
      (exception as any)?.stack,
      'ExceptionFilter',
    );

    const responseBody = {
      success: false,
      message: localizedMessage,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    try {
      if (response && typeof response.code === 'function') {
        response.code(status).send(responseBody);
      } else if ((response as any)?.status) {
        (response as any).status(status).json(responseBody);
      } else {
        console.error(
          '⚠️ Response object not compatible with Fastify or Express',
        );
        console.error('Original exception:', exception);
      }
    } catch (err) {
      console.error('⚠️ Error while sending exception response:', err);
      console.error('Original exception:', exception);
    }
  }

  /**
   * Extract language from request headers, query params, or custom header
   */
  private extractLanguage(request: FastifyRequest): string {
    // 1. Check query parameter (?lang=en)
    const queryLang = (request.query as any)?.lang;
    if (queryLang) return queryLang;

    // 2. Check custom header (x-lang)
    const customHeader = request.headers['x-lang'] as string;
    if (customHeader) return customHeader;

    // 3. Check Accept-Language header
    const acceptLanguage = request.headers['accept-language'];
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,fa;q=0.8")
      const primaryLang = acceptLanguage.split(',')[0].split('-')[0];
      return primaryLang;
    }

    // 4. Default fallback
    return 'fa';
  }
}
