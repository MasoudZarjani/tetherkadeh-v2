import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminService } from 'src/admin/admin.service';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/admin/entities/admin.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  // کش برای جلوگیری از آپدیت پشت سر هم DB
  private lastActiveCache: Map<string, number> = new Map();

  constructor(
    private readonly adminService: AdminService,
    private readonly reflector: Reflector,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new HttpException(
        { message: 'errors.unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const result = await this.adminService.profile(token);

      if (!result.user) {
        throw new HttpException(
          { message: 'errors.unauthorized' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      request.user = result.user;

      // بررسی نقش‌ها
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles && !requiredRoles.includes(result.user.type)) {
        throw new HttpException(
          { message: 'errors.forbidden' },
          HttpStatus.FORBIDDEN,
        );
      }

      // ✅ آپدیت lastActiveAt هر ۵ دقیقه یکبار
      const now = Date.now();
      const adminId = (result.user as { _id: any })._id.toString();
      const lastUpdate = this.lastActiveCache.get(adminId);

      if (!lastUpdate || now - lastUpdate > 5 * 60 * 1000) {
        await this.adminModel.findByIdAndUpdate(adminId, {
          lastActiveAt: new Date(),
        });
        this.lastActiveCache.set(adminId, now);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  private extractTokenFromHeader(authorizationHeader?: string): string | null {
    if (!authorizationHeader?.startsWith('Bearer ')) return null;
    return authorizationHeader.split(' ')[1];
  }
}
