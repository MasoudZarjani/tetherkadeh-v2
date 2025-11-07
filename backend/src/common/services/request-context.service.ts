import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestContextService {
  getIp(request: any): string {
    return request.headers['x-real-ip'] || request.raw.connection.remoteAddress;
  }

  getUserAgent(request: any): string {
    return request.headers['user-agent'];
  }

  getRequestContext(request: any) {
    return {
      ip: this.getIp(request),
      userAgent: this.getUserAgent(request),
      user: request?.user,
    };
  }
}
