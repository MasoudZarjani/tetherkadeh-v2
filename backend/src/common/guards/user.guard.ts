import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';

/**
 * Guard to protect routes for authenticated users.
 */
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new HttpException(
        { message: ['Unauthorized: Token not provided'], success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const result = await this.userService.profile(token);

      if (!result.user) {
        throw new HttpException(
          { message: 'errors.unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      request.user = result.user;
      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.split(' ')[1];
  }
}
