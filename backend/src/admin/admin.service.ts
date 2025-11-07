import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ChangeStatusAdminDto, UpdateAdminDto } from './dto/update-admin.dto';
import * as msg from '../utils/messages.json';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Admin, AdminDocument } from './entities/admin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminStatus } from './enums/AdminStatus.enum';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ListAdminDto } from './dto/list-admin.dto';
import { UploadService } from 'src/helpers/upload/upload.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    private uploadService: UploadService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      let admin = await this.adminModel.findOne({
        email: createAdminDto.email.toLowerCase(),
      });
      if (admin) {
        throw new BadRequestException('adminExists');
      }
      let payload: any = {
        ...createAdminDto,
        email: createAdminDto.email.toLowerCase(),
        password: await bcrypt.hash(`${createAdminDto.password}`, 10),
        status: AdminStatus.Active,
      };
      admin = await this.adminModel.create(payload);
      return { user: { email: createAdminDto.email } };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(loginAdminDto: LoginAdminDto) {
    try {
      let { user, password } = loginAdminDto;
      user = user.toLowerCase();
      let admin = await this.adminModel.findOne({
        $or: [{ mobile: user }, { email: user }],
      });
      if (!admin) {
        throw new NotFoundException('adminNotFound');
      }
      if (
        admin.status == AdminStatus.Deleted ||
        admin.status == AdminStatus.Suspend
      ) {
        throw new BadRequestException('adminSuspended');
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        throw new UnauthorizedException('incorrectUserOrPassword');
      }
      const token = jwt.sign(
        {
          _id: admin._id,
          iss: process.env.APP_NAME,
          exp: Date.now() + 24 * 60 * 60 * 1000 * 7, // 7 days
        },
        process.env.JWT_SECRET_ADMIN || 'secret',
      );
      admin.set({ lastActiveAt: new Date() });
      await admin.save();
      const newAdmin = await this.adminModel.findById(admin._id, '-password');
      return {
        token,
        admin: newAdmin,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(listAdminDto: ListAdminDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
        status = 'all',
        type = 'all',
      } = listAdminDto;
      const skip = (page - 1) * limit;
      let query = {};
      if (search) {
        const regex = new RegExp(search, 'i'); // i برای case-insensitive
        query = {
          $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { mobile: regex },
          ],
        };
      }
      let match: any = {
        status,
        type,
        ...query,
      };
      if (status === 'all') delete match['status'];
      if (type === 'all') delete match['type'];
      const sortObj: Record<string, 1 | -1> = {
        [sort]: order === -1 ? -1 : 1,
      };
      const [data, total] = await Promise.all([
        this.adminModel
          .find(match)
          .sort(sortObj)
          .select('-password') // Exclude password from the result
          .skip(skip)
          .limit(limit)
          .exec(),
        this.adminModel.countDocuments(match).exec(),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async profile(token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException('adminNotFound');
      }
      var decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET_ADMIN || 'secret',
      );
      const admin = await this.adminModel.findById(decoded._id, '-password');
      if (!admin) {
        throw new UnauthorizedException('adminNotFound');
      }
      return {
        user: admin,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        throw new NotFoundException('adminNotFound');
      }
      if (updateAdminDto.password && updateAdminDto.oldPassword) {
        const isPasswordValid = await bcrypt.compare(
          updateAdminDto.oldPassword,
          admin.password,
        );
        if (!isPasswordValid) {
          throw new BadRequestException('incorrectOldPassword');
        }
        const isSamePassword = await bcrypt.compare(
          updateAdminDto.password,
          admin.password,
        );
        if (isSamePassword) {
          throw new BadRequestException('samePasswordErrors');
        }
      }
      if (updateAdminDto.email) {
        let duplicateAdmin = await this.adminModel.findOne({
          email: updateAdminDto.email,
          _id: { $ne: admin._id },
        });
        if (duplicateAdmin) {
          return {
            success: false,
            message: msg.emailExists,
            status: HttpStatus.BAD_REQUEST,
          };
        }
      }
      let newPassword = admin.password;
      if (updateAdminDto.password) {
        newPassword = await bcrypt.hash(`${updateAdminDto.password}`, 10);
      }
      admin.set({ ...updateAdminDto, password: newPassword });
      await admin.save();
      return admin;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeStatus(id: string, changeStatusAdminDto: ChangeStatusAdminDto) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        throw new NotFoundException('adminNotFound');
      }
      admin.set(changeStatusAdminDto);
      await admin.save();
      return admin;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async upload(file: any): Promise<any> {
    try {
      const filename = await this.uploadService.saveFile(file, 'admin');
      if (!filename) {
        throw new BadRequestException('uploadFailed');
      }
      return filename;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAdminById(id: string) {
    try {
      const admin = await this.adminModel.findById(id);
      if (!admin) {
        throw new NotFoundException('adminNotFound');
      }
      return admin;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
