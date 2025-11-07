import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import * as msg from '../utils/messages.json';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { UserStatus } from './enums/UserStatus.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserTypeAuth } from './enums/UserTypeAuth.enum';
import ShortUniqueId from 'short-unique-id';
import { UserRequestAuth } from './enums/UserRequestAuth.enum';
import { Referral, ReferralDocument } from './entities/referral.entity';
import { MessageService } from 'src/message/message.service';
import { Level, LevelDocument } from './entities/level.entity';
import { LevelStatus } from './enums/LevelStatus.enum';
import { LevelType } from './enums/LevelType.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotPasswordDto } from './dto/verify-forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { SetEmailDto } from './dto/set-email.dto';
import { VerifyCodeDto } from './dto/verify-code';
import { SetKycDto } from './dto/set-kyc.dto';
import { ResendUserDto } from './dto/resend-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CheckToken2FV } from './dto/check-2fv.dto';
import { UserType } from './interface/UserType.interface';
import { UploadService } from 'src/helpers/upload/upload.service';
import { ListUserDto } from './dto/list-user.dto';
import { SetStepDto } from './dto/set-step.dto';
import { ChangeStepUserDto } from './dto/change-step-user.dto';
import { ChangeStatusUserDto } from './dto/change-status-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AddNoteUserDto } from './dto/add-note-user.dto';
import { SettingService } from 'src/setting/setting.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { SetMobileDto } from './dto/set-mobile.dto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface LoginContext {
  ip: string;
  userAgent: string;
}

export interface LoginResponse {
  success: boolean;
  status: HttpStatus;
  message: string;
  level: any;
  token: string;
  user: any;
}

export type UserIdentifierType = 'email' | 'mobile' | 'none';

export interface RegisterContext {
  ip: string;
  userAgent: string;
}

export interface RegisterResponse {
  success: boolean;
  status: HttpStatus;
  message: string;
  user: {
    email?: string;
    mobile?: string;
  };
}

interface UserPayload {
  email: string | null;
  mobile: string | null;
  password: string;
  token: number;
  sendMailAt: Date;
  invitationCode: string;
  status: UserStatus;
  uid: string;
  invitedBy?: string;
  twoStepVerification: boolean;
}

@Injectable()
export class UserService implements OnModuleInit {
  private _settings: any;
  private oauthClient: OAuth2Client;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Referral.name)
    private referralModel: Model<ReferralDocument>,
    @InjectModel(Level.name)
    private levelModel: Model<LevelDocument>,
    private messageService: MessageService,
    private readonly settingService: SettingService,
    private uploadService: UploadService,
    private jwtService: JwtService,
  ) {
    this.oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage', // برای useCodeClient باید postmessage باشه
    );
  }

  // ============================================================================
  // TYPE GUARDS
  // ============================================================================

  private _isUserDocument(user: UserType | UserDocument): user is UserDocument {
    return 'save' in user && typeof (user as any).save === 'function';
  }

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  private _validateUserInputType(userInput: string): UserIdentifierType {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^09\d{9}$/;

    if (emailPattern.test(userInput)) {
      return 'email';
    }
    if (mobilePattern.test(userInput)) {
      return 'mobile';
    }
    return 'none';
  }

  // ============================================================================
  // DATABASE QUERY METHODS
  // ============================================================================

  private async _findUserByVerifiedCredentials(
    userInput: string,
  ): Promise<UserType | null> {
    return this.userModel.findOne({
      $or: [
        { email: userInput, isEmailVerified: true },
        { mobile: userInput, isMobileVerified: true },
      ],
      status: { $ne: UserStatus.Deleted },
    });
  }

  private async _findUnverifiedUser(
    userInput: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [{ email: userInput }, { mobile: userInput }],
      status: { $ne: UserStatus.Deleted },
    });
  }

  // ============================================================================
  // TOKEN GENERATION & SENDING
  // ============================================================================

  private _generateVerificationToken(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async _sendVerificationToken(
    user: UserDocument | UserType,
    token: number,
    context: LoginContext,
  ): Promise<void> {
    // اگر UserDocument است، مستقیم save می‌کنیم
    if (this._isUserDocument(user)) {
      user.token = token;
      user.sendMailAt = new Date();
      await user.save();
    } else {
      // اگر UserType است، باید از طریق Model آپدیت کنیم
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            token: token,
            sendMailAt: new Date(),
          },
        },
      );
    }

    await this.messageService.sendMessage({
      ip: context.ip,
      userAgent: context.userAgent,
      user: user,
      code: 'sendTokenVerify',
      dataMessage: { code: token.toString() },
    });
  }

  // ============================================================================
  // USER STATUS & VERIFICATION CHECKS
  // ============================================================================

  private _checkUserStatus(user: UserType): void {
    if (user.status === UserStatus.Blocked) {
      throw new BadRequestException('userBlocked');
    }
  }

  private async _handleUnverifiedUser(
    user: UserDocument,
    type: UserIdentifierType,
    context: LoginContext,
  ): Promise<void> {
    const isUnverified =
      (type === 'email' && !user.isEmailVerified) ||
      (type === 'mobile' && !user.isMobileVerified);

    if (isUnverified) {
      const token = this._generateVerificationToken();
      await this._sendVerificationToken(user, token, context);

      throw new NotAcceptableException(
        type === 'email' ? 'emailNotVerified' : 'mobileNotVerified',
      );
    }
  }

  // ============================================================================
  // PASSWORD VERIFICATION
  // ============================================================================

  private async _verifyPassword(
    passwordClear: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(passwordClear, passwordHash);
  }

  // ============================================================================
  // TWO-FACTOR AUTHENTICATION (2FA)
  // ============================================================================

  private async _handleTwoFactorVerification(
    user: UserType,
    loginDto: LoginUserDto,
  ): Promise<void> {
    if (!user.twoFactorVerification) {
      return;
    }

    if (!loginDto.code) {
      throw new ConflictException('codeRequired');
    }

    const verified = speakeasy.totp.verify({
      secret: user.token2FV,
      encoding: 'base32',
      token: loginDto.code,
    });

    if (!verified) {
      throw new ForbiddenException('codeNotCorrect');
    }
  }

  // ============================================================================
  // TWO-STEP VERIFICATION (2SV)
  // ============================================================================

  private async _handleTwoStepVerification(
    user: UserType,
    loginDto: LoginUserDto,
    context: LoginContext,
  ): Promise<void> {
    if (!user.twoStepVerification) {
      return;
    }

    if (!loginDto.code) {
      const token = this._generateVerificationToken();
      await this._sendVerificationToken(user, token, context);
      throw new MethodNotAllowedException('codeRequired');
    }

    // استفاده از strict equality برای امنیت بیشتر
    if (loginDto.code !== user.token.toString()) {
      throw new ForbiddenException('codeNotCorrect');
    }

    // ارسال پیام موفقیت‌آمیز فعال‌سازی
    await this.messageService.sendMessage({
      ip: context.ip,
      userAgent: context.userAgent,
      user: user,
      code: 'activeEmailUser',
    });
  }

  // ============================================================================
  // JWT TOKEN GENERATION
  // ============================================================================

  private async _generateJwtToken(user: UserType): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user._id },
      {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      },
    );
  }

  // ============================================================================
  // RESPONSE PREPARATION
  // ============================================================================

  private _shouldShowKycIntro(user: any): boolean {
    return (
      this._settings.kycIntro &&
      user.status !== UserStatus.Approved &&
      user.status === UserStatus.Register &&
      user.stepAuth === UserTypeAuth.None &&
      user.stepRequest === UserTypeAuth.None
    );
  }

  private async _prepareSuccessResponse(
    user: any,
    token: string,
    level: any,
    hasProvidedCode: boolean,
    context: LoginContext,
  ): Promise<LoginResponse> {
    // ارسال پیام لاگین موفق فقط در صورتی که کد ارائه نشده باشد
    if (!hasProvidedCode) {
      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: user,
        code: 'successLogin',
      });
    }

    const baseResponse = {
      success: true,
      message: msg.success,
      level,
      token,
      user,
    };

    // اگر نیاز به تکمیل KYC باشد
    if (this._shouldShowKycIntro(user)) {
      return {
        ...baseResponse,
        status: HttpStatus.PARTIAL_CONTENT,
      };
    }

    return {
      ...baseResponse,
      status: HttpStatus.OK,
    };
  }

  // ============================================================================
  // MAIN LOGIN METHOD
  // ============================================================================

  async login(
    data: LoginUserDto,
    context: LoginContext,
  ): Promise<LoginResponse> {
    try {
      // 1. اعتبارسنجی نوع ورودی کاربر
      const userIdentifierType = this._validateUserInputType(data.user);
      if (userIdentifierType === 'none') {
        throw new BadRequestException('invalidUserFormat');
      }

      // 2. یافتن کاربر با اعتبارسنجی شده
      let user = await this._findUserByVerifiedCredentials(data.user);

      // 3. بررسی کاربر غیرفعال
      if (!user) {
        const unverifiedUser = await this._findUnverifiedUser(data.user);

        if (unverifiedUser) {
          await this._handleUnverifiedUser(
            unverifiedUser,
            userIdentifierType,
            context,
          );
        }

        throw new NotFoundException('userNotFound');
      }

      // 4. بررسی وضعیت کاربر (مسدود یا نه)
      this._checkUserStatus(user);

      // 5. بررسی رمز عبور
      const validPassword = await this._verifyPassword(
        data.password,
        user.password,
      );
      if (!validPassword) {
        throw new NotFoundException('incorrectUserOrPassword');
      }

      // 6. بررسی احراز هویت دو مرحله‌ای (2FA)
      await this._handleTwoFactorVerification(user, data);

      // 7. بررسی تأیید دو مرحله‌ای (2SV)
      await this._handleTwoStepVerification(user, data, context);

      // 8. تولید JWT Token
      const token = await this._generateJwtToken(user);

      // 9. تبدیل به JSON و محاسبه سطح کاربر
      const userJson = (user as any).toJSON();
      const invitedCount = await this.getInvitedCount({ user: userJson._id });
      const level = await this.setLevel(invitedCount, userJson);

      // 10. آماده‌سازی و ارسال پاسخ
      return this._prepareSuccessResponse(
        userJson,
        token,
        level,
        !!data.code,
        context,
      );
    } catch (error) {
      // مدیریت خطاها
      if (error instanceof HttpException) {
        throw error;
      }

      // لاگ خطای سیستمی برای دیباگ
      console.error('Login failed:', error);
      throw new InternalServerErrorException('loginFailed');
    }
  }

  // ============================================================================
  // DATABASE CLEANUP
  // ============================================================================

  private async _deleteUnverifiedUsers(userInput: string): Promise<void> {
    await this.userModel.deleteMany({
      $or: [{ mobile: userInput }, { email: userInput }],
      isEmailVerified: false,
      isMobileVerified: false,
    });
  }

  // ============================================================================
  // USER EXISTENCE CHECKS
  // ============================================================================

  private async _checkExistingVerifiedUser(
    userInput: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({
      $or: [
        {
          email: userInput,
          isEmailVerified: true,
          status: { $ne: UserStatus.Deleted },
        },
        {
          mobile: userInput,
          isMobileVerified: true,
          status: { $ne: UserStatus.Deleted },
        },
      ],
    });
  }

  // ============================================================================
  // UID GENERATION
  // ============================================================================

  private generateUID(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async isUIDUnique(uid: string): Promise<boolean> {
    const existingUID = await this.userModel.findOne({ uid });
    return !existingUID;
  }

  public async createUniqueUID(): Promise<string> {
    let uid: string;
    let isUnique = false;

    do {
      uid = this.generateUID();
      isUnique = await this.isUIDUnique(uid);
    } while (!isUnique);

    return uid;
  }

  // ============================================================================
  // INVITATION CODE GENERATION
  // ============================================================================

  private async _generateUniqueInvitationCode(): Promise<string> {
    let code: string;
    let isUnique = false;

    do {
      code = new ShortUniqueId().randomUUID(6);
      const existing = await this.referralModel.findOne({ code });
      isUnique = !existing;
    } while (!isUnique);

    return code;
  }

  // ============================================================================
  // USER PAYLOAD PREPARATION
  // ============================================================================

  private async _prepareUserPayload(
    data: CreateUserDto,
    type: UserIdentifierType,
  ): Promise<UserPayload> {
    const verificationToken = Math.floor(100000 + Math.random() * 900000);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const invitationCode = await this._generateUniqueInvitationCode();
    const uid = await this.createUniqueUID();

    return {
      email: type === 'email' ? data.user : null,
      mobile: type === 'mobile' ? data.user : null,
      password: passwordHash,
      token: verificationToken,
      sendMailAt: new Date(),
      invitationCode: invitationCode,
      twoStepVerification: true,
      status: this._settings.activeKyc
        ? UserStatus.Register
        : UserStatus.Trusted,
      uid: uid,
      invitedBy: data.invitedBy,
    };
  }

  // ============================================================================
  // INVITATION LOGIC
  // ============================================================================

  private async _validateInvitationCode(
    invitedByCode: string,
  ): Promise<boolean> {
    const referral = await this.referralModel.findOne({
      code: invitedByCode,
      isActive: true,
    });

    // اگر کد دعوت پیدا نشد، نامعتبر است
    if (!referral) {
      return false;
    }

    // بررسی اینکه آیا کاربر دعوت‌کننده هنوز فعال است
    const inviter = await this.userModel.findOne({
      _id: referral.user,
      status: { $ne: UserStatus.Deleted },
    });

    return !!inviter;
  }

  // ============================================================================
  // USER CREATION
  // ============================================================================

  private async _createUserInDatabase(
    payload: UserPayload,
  ): Promise<UserDocument> {
    return this.userModel.create(payload);
  }

  // ============================================================================
  // VERIFICATION MESSAGE
  // ============================================================================

  private async _sendVerificationMessage(
    user: UserDocument,
    context: RegisterContext,
  ): Promise<void> {
    await this.messageService.sendMessage({
      ip: context.ip,
      userAgent: context.userAgent,
      user: user.toObject(),
      code: 'sendTokenVerify',
      dataMessage: { code: user.token.toString() },
    });
  }

  // ============================================================================
  // DEFAULT REFERRAL CREATION
  // ============================================================================

  private async _createDefaultReferral(
    userId: string,
    invitationCode: string,
  ): Promise<void> {
    await this.referralModel.create({
      user: userId,
      invitedCommission: 0,
      inviterCommission: 100,
      code: invitationCode,
      isDefault: true,
      isMarketing: false,
      isActive: true,
    });
  }

  // ============================================================================
  // RESPONSE PREPARATION
  // ============================================================================

  private _prepareRegisterResponse(
    userInput: string,
    type: UserIdentifierType,
  ): RegisterResponse {
    return {
      success: true,
      status: HttpStatus.CREATED,
      message: msg.success,
      user: {
        [type]: userInput,
      },
    };
  }

  // ============================================================================
  // MAIN REGISTER METHOD
  // ============================================================================

  async register(
    data: CreateUserDto,
    context: RegisterContext,
  ): Promise<RegisterResponse> {
    try {
      // 1. اعتبارسنجی نوع ورودی کاربر
      const userInputType = this._validateUserInputType(data.user);
      if (userInputType === 'none') {
        throw new BadRequestException('invalidUserFormat');
      }

      // 2. حذف کاربران تأیید نشده قبلی
      await this._deleteUnverifiedUsers(data.user);

      // 3. بررسی وجود کاربر تأیید شده
      const existingUser = await this._checkExistingVerifiedUser(data.user);
      if (existingUser) {
        throw new ConflictException('userExists');
      }

      // 4. اعتبارسنجی کد دعوت (در صورت وجود)
      if (data.invitedBy) {
        const isValidInvitation = await this._validateInvitationCode(
          data.invitedBy,
        );
        if (!isValidInvitation) {
          throw new BadRequestException('invalidInvitedBy');
        }
      }

      // 5. آماده‌سازی payload کاربر
      const payload = await this._prepareUserPayload(data, userInputType);

      // 6. ایجاد کاربر در دیتابیس
      const newUser = await this._createUserInDatabase(payload);

      // 7. ارسال پیام تأیید
      await this._sendVerificationMessage(newUser, context);

      // 8. ایجاد referral پیش‌فرض با همان invitationCode
      const code = await this.createUniqueUID();
      await this._createDefaultReferral(newUser._id.toString(), code);

      // 9. آماده‌سازی و ارسال پاسخ
      return this._prepareRegisterResponse(data.user, userInputType);
    } catch (error) {
      // مدیریت خطاها
      if (error instanceof HttpException) {
        throw error;
      }

      // لاگ خطای سیستمی برای دیباگ
      console.error('Registration failed:', error);
      throw new InternalServerErrorException('registerFailed');
    }
  }

  async getInvitedCount(data: { user: string }): Promise<number> {
    try {
      // دریافت تمام کدهای referral فعال کاربر
      const referralCodes = await this.referralModel
        .find({
          user: data.user,
          isActive: true,
        })
        .distinct('code');

      // شمارش کاربران دعوت‌شده تأیید شده
      const countUsers = await this.userModel.countDocuments({
        status: UserStatus.Approved,
        stepAuth: {
          $in: [UserRequestAuth.Step1, UserRequestAuth.Step2],
        },
        invitedBy: {
          $in: referralCodes,
        },
      });

      return countUsers;
    } catch (error) {
      console.error('Get invited count failed:', error);
      throw new InternalServerErrorException('getInvitedCountFailed');
    }
  }

  async getUserById(id: string) {
    try {
      let user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('userNotFound');

      return {
        user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setLevel(invitedCount: number, user: any) {
    try {
      if (user.customLevel) {
        const levelUser = await this.levelModel.findById(user.customLevel);
        return levelUser;
      }

      // const wallets = await this.walletModel.find({
      //   user: user._id,
      //   coin: 'USDT',
      //   type: { $in: [TypeWallet.deposit, TypeWallet.withdraw] },
      //   status: StatusWallet.active,
      // });

      let userVolume = 0;
      // wallets.map((item) => {
      //   userVolume += item.amount != null ? item.amount : 0;
      // });
      const levelUser = await this.levelModel.find({
        status: LevelStatus.Active,
        type: LevelType.Commission,
      });

      let level = levelUser.find((item) => {
        if (item.isVolumeTransaction && item.isInvited) {
          if (
            (userVolume >= item.fromVolumeTransaction &&
              userVolume <= item.toVolumeTransaction) ||
            (invitedCount >= item.fromInvited && invitedCount <= item.toInvited)
          ) {
            return item;
          }
        } else if (item.isVolumeTransaction) {
          if (
            userVolume >= item.fromVolumeTransaction &&
            userVolume <= item.toVolumeTransaction
          ) {
            return item;
          }
        } else if (item.isInvited) {
          if (
            invitedCount >= item.fromInvited &&
            invitedCount <= item.toInvited
          ) {
            return item;
          }
        }
      });
      if (!level) level = levelUser[levelUser.length - 1];
      return level;
    } catch (error) {
      console.log(error);
      return {
        success: false,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: msg.getLevelFailed,
      };
    }
  }

  async profile(token: string) {
    try {
      if (!token) throw new UnauthorizedException('userNotFound');
      var decoded: any = await this.jwtService.verifyAsync(token);
      const user = await this.userModel
        .findById(decoded.sub, '-password')
        .exec();
      if (!user) throw new UnauthorizedException('userNotFound');

      return {
        user,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async forgotPassword(data: ForgotPasswordDto, context: any) {
    try {
      const userIdentifierType = this._validateUserInputType(data.user);
      if (userIdentifierType === 'none')
        throw new BadRequestException('invalidUserFormat');

      let user: any = await this.userModel.findOne({
        $or: [
          {
            email: data.user,
            isEmailVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
          {
            mobile: data.user,
            isMobileVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
        ],
      });
      if (!user) throw new UnauthorizedException('userNotFound');

      let code = Math.floor(100000 + Math.random() * 900000);
      user.token = code;
      await user.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: user,
        code: 'forgotPassword',
        dataMessage: { code: code.toString() },
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyForgotPassword(data: VerifyForgotPasswordDto, context: any) {
    try {
      const userIdentifierType = this._validateUserInputType(data.user);
      if (userIdentifierType === 'none')
        throw new BadRequestException('invalidUserFormat');
      let user: any = await this.userModel.findOne({
        $or: [
          {
            email: data.user,
            isEmailVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
          {
            mobile: data.user,
            isMobileVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
        ],
      });

      if (!user) throw new UnauthorizedException('userNotFound');

      if (!user.token || data.code != user.token)
        throw new ForbiddenException('codeNotCorrect');

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto, context: any) {
    try {
      let username = data.user.toLowerCase().trim();

      const userIdentifierType = this._validateUserInputType(data.user);
      if (userIdentifierType === 'none')
        throw new BadRequestException('invalidUserFormat');

      let user: any = await this.userModel.findOne({
        $or: [
          {
            email: username,
            isEmailVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
          {
            mobile: username,
            isMobileVerified: true,
            status: { $ne: UserStatus.Deleted },
          },
        ],
      });

      if (!user) throw new UnauthorizedException('userNotFound');

      user.password = await bcrypt.hash(data.password, 10);

      await (user as any).save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: user,
        code: 'verifyForgotPassword',
      });

      // await this.messageService.sendMessage({
      //   ip: context.ip,
      //   userAgent: context.userAgent,
      //   user: user,
      //   code: 'resetPassword',
      // });
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async confirm(data: ConfirmUserDto, context: any) {
    try {
      const userIdentifierType = this._validateUserInputType(data.user); // Assuming this method does not throw standard exceptions
      if (userIdentifierType === 'none') {
        throw new BadRequestException('invalidUserFormat');
      }
      let objQuery = {};
      if (this._settings.authSender == 'email')
        objQuery = {
          email: data.user.toLowerCase(),
          isEmailVerified: false,
        };

      if (this._settings.authSender == 'sms') {
        objQuery = {
          mobile: data.user.toLowerCase(),
          isMobileVerified: false,
        };
      }

      let user = await this.userModel.findOne(objQuery);
      if (!user) throw new UnauthorizedException('userNotFound');
      if (data.code != user.token.toString())
        throw new ForbiddenException('codeNotCorrect');

      if (this._settings.authSender == 'email') user.isEmailVerified = true;

      if (this._settings.authSender == 'sms') user.isMobileVerified = true;

      await (user as any).save();
      const token = await this._generateJwtToken(user as any);

      const invitedCount = await this.getInvitedCount({
        user: user._id.toString(),
      });
      let level = this.setLevel(invitedCount, user);

      if (this._settings.activeGiftForRegister) {
        if (this._settings.statusGiftRegister == UserStatus.Register) {
          // await this.exchangeClient
          //   .send(
          //     {
          //       cmd: 'chargeWallet',
          //       service: 'wallet',
          //       channel: 'exchange',
          //     },
          //     {
          //       traderId: trader._id,
          //       amount: countGiftRegister,
          //       type: 'deposit',
          //       typeTransaction: 'gift',
          //       coin: symbolGiftRegister,
          //     },
          //   )
          //   .pipe(timeout(10000))
          //   .toPromise();
        }
      }

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: user,
        code: 'activeUser',
      });

      if (this._settings.kycIntro) {
        return {
          user: user.toJSON(),
          level,
          token,
        };
      }
      return {
        user: user.toJSON(),
        level,
        token,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setEmail(data: SetEmailDto, context: any) {
    try {
      let userEmail = await this.userModel.findOne({
        email: data.email.toLowerCase(),
        _id: {
          $ne: context.user.sub,
        },
        status: {
          $nin: [UserStatus.Deleted],
        },
      });
      if (userEmail) {
        throw new BadRequestException('emailAlreadyExists');
      }
      let userInfo = await this.userModel.findById(context.user.sub);
      if (!userInfo) throw new UnauthorizedException('userNotFound');
      if (userInfo.isEmailVerified) {
        throw new BadRequestException('emailAlreadyExists');
      }
      let code = Math.floor(100000 + Math.random() * 900000);
      userInfo.token = code;
      userInfo.email = data.email.toLowerCase();
      userInfo.sendMailAt = new Date();
      await userInfo.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'sendEmailUser',
        dataMessage: { code: code.toString() },
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async setMobile(data: SetMobileDto, context: any) {
    try {
      let userMobile = await this.userModel.findOne({
        mobile: data.mobile,
        _id: {
          $ne: context.user.sub,
        },
        status: {
          $nin: [UserStatus.Deleted],
        },
      });
      if (userMobile) {
        throw new BadRequestException('mobileAlreadyExists');
      }
      let userInfo = await this.userModel.findById(context.user.sub);
      if (!userInfo) throw new UnauthorizedException('userNotFound');
      if (userInfo.isMobileVerified) {
        throw new BadRequestException('mobileAlreadyExists');
      }
      let code = Math.floor(100000 + Math.random() * 900000);
      userInfo.token = code;
      userInfo.mobile = data.mobile.toLowerCase();
      userInfo.sendMailAt = new Date();
      await userInfo.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'sendTokenVerify',
        dataMessage: { code: code.toString() },
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyCode(data: VerifyCodeDto, context: any) {
    try {
      let userInfo = await this.userModel.findById(context.user.sub);
      if (!userInfo) throw new UnauthorizedException('userNotFound');

      if (data.code != userInfo.token)
        throw new ForbiddenException('codeNotCorrect');

      if (data.type === 'email') userInfo.isEmailVerified = true;
      if (data.type === 'mobile') userInfo.isMobileVerified = true;

      await userInfo.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'activeEmailUser',
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async upload(file: any): Promise<any> {
    try {
      const filename = await this.uploadService.saveFile(file, 'user');
      if (!filename) {
        throw new BadRequestException('uploadFailed');
      }
      return filename;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async setKyc(data: SetKycDto, context: any) {
    const userInfo = await this.userModel.findById(context.user.sub);
    if (!userInfo) throw new UnauthorizedException('userNotFound');

    if (data.nationalCode) {
      let userNationalCode = await this.userModel.findOne({
        nationalCode: data.nationalCode,
        _id: {
          $ne: userInfo._id,
        },
        status: {
          $nin: [UserStatus.Deleted],
        },
      });
      if (userNationalCode)
        throw new BadRequestException('nationalAlreadyExists');
    }
    if (data.step == UserTypeAuth.Step1) {
      userInfo.stepRequest = UserRequestAuth.PendingStep1;

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'requestStep1',
      });

      if (this._settings.jibitActive) {
        const resultLogin = await fetch(
          `https://napi.jibit.ir/ide/v1/tokens/generate`,
          {
            method: 'POST',
            body: JSON.stringify({
              apiKey: this._settings.jibitApiKey,
              secretKey: this._settings.jibitSecretKey,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const dataInfoLogin: any = await resultLogin.json();
        if ([201, 200].includes(resultLogin.status)) {
          const resp = await fetch(
            `https://napi.jibit.ir/ide/v1/services/matching?mobileNumber=${userInfo.mobile}&nationalCode=${data.nationalCode}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${dataInfoLogin.accessToken}`,
              },
            },
          );
          const dataInfo = await resp.json();
          if (!dataInfo.matched)
            throw new BadRequestException('nationalNotValid');

          userInfo.stepAuth = UserTypeAuth.Step1;

          if (
            this._settings.activeGiftForRegister &&
            this._settings.statusGiftRegister === UserRequestAuth.Step1
          ) {
            // await this.exchangeClient
            //   .send(
            //     {
            //       cmd: 'chargeWallet',
            //       service: 'wallet',
            //       channel: 'exchange',
            //     },
            //     {
            //       UserId: userInfo._id,
            //       amount: countGiftRegister,
            //       type: 'deposit',
            //       typeTransaction: 'gift',
            //       coin: symbolGiftRegister,
            //     },
            //   )
            //   .pipe(timeout(10000))
            //   .toPromise();
          }
        }
      }
    }
    if (data.step == UserTypeAuth.Step2) {
      userInfo.stepRequest = UserRequestAuth.PendingStep2;
      userInfo.stepAuth = UserTypeAuth.Step2;

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'requestStep2',
      });
    }
    await this.messageService.sendTelegramMessage(
      `یک درخواست احراز هویت توسط ${userInfo.firstName} ${userInfo.lastName} با شماره کاربری ${userInfo.uid} ثبت شده است.`,
    );
    userInfo.set({ ...data });
    await userInfo.save();

    return true;
  }

  async resend(data: ResendUserDto) {
    let objQuery = {};
    if (this._settings.authSender == 'email')
      objQuery = {
        email: data.user.toLowerCase(),
        isEmailVerified: false,
      };

    if (this._settings.authSender == 'sms')
      objQuery = {
        mobile: data.user,
        isMobileVerified: false,
      };

    let user = await this.userModel.findOne(objQuery);
    if (!user) throw new UnauthorizedException('userNotFound');

    let expireMailTime = new Date(user.sendMailAt).getTime() + 5 * 60 * 1000;
    if (expireMailTime > new Date().getTime()) {
      let remindMin = parseInt(
        ((expireMailTime - new Date().getTime()) / 1000 / 60).toString(),
      );
      let remindSec = parseInt(
        (((expireMailTime - new Date().getTime()) / 1000) % 60).toString(),
      );
      throw new BadRequestException(
        `${msg.expireTimeCode} ${remindMin} : ${remindSec}`,
      );
    }

    let code = Math.floor(100000 + Math.random() * 900000);
    user.token = code;
    user.sendMailAt = new Date();
    await (user as any).save();

    if (this._settings.authSender == 'email')
      await this.messageService.sendTokenVerify({
        user: data.user,
        code: code.toString(),
        type: 'email',
      });
    if (this._settings.authSender == 'sms')
      await this.messageService.sendTokenVerify({
        user: data.user,
        code: code.toString(),
        type: 'sms',
      });

    return {
      user: data.user,
    };
  }

  async update(updateUserDto: UpdateUserDto, context: any) {
    const userData = await this.userModel.findById(context.user.sub);
    if (!userData) throw new UnauthorizedException('userNotFound');

    let oldStatus = userData.status;
    userData.status = UserStatus.Pending;

    if (updateUserDto.password && updateUserDto.oldPassword) {
      const validPassword = await bcrypt.compare(
        updateUserDto.oldPassword,
        userData.password,
      );
      if (!validPassword)
        throw new BadRequestException('notCorrectOldPassword');

      updateUserDto.password = await bcrypt.hash(
        `${updateUserDto.password}`,
        10,
      );
      userData.status = oldStatus;
      userData.set({ ...updateUserDto });
      await userData.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userData,
        code: 'changePasswordUser',
      });

      return true;
    }
    if (updateUserDto.twoStepVerification != null) {
      userData.twoFactorVerification = false;
      userData.status = oldStatus;
    }

    if (userData.nationalCode) {
      let userNationalCode = await this.userModel.findOne({
        nationalCode: updateUserDto.nationalCode,
        _id: {
          $ne: context.user.sub,
        },
        status: {
          $nin: [UserStatus.Deleted],
        },
      });
      if (userNationalCode)
        throw new BadRequestException('nationalAlreadyExists');
    }

    if (
      updateUserDto.password == null &&
      updateUserDto.twoStepVerification == null &&
      !updateUserDto.docs &&
      this._settings.jibitActive
    ) {
      try {
        const resultLogin = await fetch(
          `https://napi.jibit.ir/ide/v1/tokens/generate`,
          {
            method: 'POST',
            body: JSON.stringify({
              apiKey: this._settings.jibitApiKey,
              secretKey: this._settings.jibitSecretKey,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const dataInfoLogin: any = await resultLogin.json();
        if ([201, 200].includes(resultLogin.status)) {
          const resp = await fetch(
            `https://napi.jibit.ir/ide/v1/services/matching?mobileNumber=${userData.mobile}&nationalCode=${updateUserDto.nationalCode}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${dataInfoLogin.accessToken}`,
              },
            },
          );
          const dataInfo = await resp.json();
          if (!dataInfo.matched) {
            throw new BadRequestException(dataInfo.message);
          } else {
            userData.status = UserStatus.Approved;

            if (
              this._settings.activeGiftForRegister &&
              this._settings.statusGiftRegister == UserStatus.Approved
            ) {
              // await this.exchangeClient
              //   .send(
              //     {
              //       cmd: 'chargeWallet',
              //       service: 'wallet',
              //       channel: 'exchange',
              //     },
              //     {
              //       traderId: trader._id,
              //       amount: countGiftRegister,
              //       type: 'deposit',
              //       typeTransaction: 'gift',
              //       coin: symbolGiftRegister,
              //     },
              //   )
              //   .pipe(timeout(10000))
              //   .toPromise();
            }
          }
        }
      } catch (error) {
        userData.status = UserStatus.Pending;
        await this.messageService.sendMessage({
          ip: context.ip,
          userAgent: context.userAgent,
          user: userData,
          code: 'pendingUser',
        });
        throw new UnauthorizedException('userNotFound');
      }
      userData.set({ ...updateUserDto });
      await userData.save();
      return true;
    }
  }

  async getToken2FV(context: any) {
    const userData = await this.userModel.findById(context.user.sub);
    if (!userData) throw new UnauthorizedException('userNotFound');

    let secretCode = speakeasy.generateSecret({
      name: this._settings.emailAppName,
    });

    if (!secretCode) throw new UnauthorizedException('userNotFound');

    userData.token2FV = secretCode.base32;
    let urlToken = secretCode.otpauth_url;
    await userData.save();

    await this.messageService.sendMessage({
      ip: context.ip,
      userAgent: context.userAgent,
      user: userData,
      code: 'getToken2FV',
    });

    return {
      urlToken,
      token: secretCode.base32,
    };
  }

  async checkToken2FV(checkToken2FV: CheckToken2FV, context: any) {
    const userData = await this.userModel.findById(context.user.sub);
    if (!userData) throw new UnauthorizedException('userNotFound');

    const verified = speakeasy.totp.verify({
      secret: userData.token2FV,
      encoding: 'base32',
      token: checkToken2FV.code,
    });

    if (!verified) throw new ForbiddenException('codeNotCorrect');

    await this.messageService.sendMessage({
      ip: context.ip,
      userAgent: context.userAgent,
      user: userData,
      code: 'twoFactorVerification',
    });

    userData.twoFactorVerification = true;
    userData.twoStepVerification = false;
    await userData.save();
    return {
      userData,
    };
  }

  async findAll(listUserDto: ListUserDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
        status = 'all',
        stepRequest = 'all',
      } = listUserDto;
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
        stepRequest,
        ...query,
      };
      if (status === 'all') delete match['status'];
      if (stepRequest === 'all') delete match['stepRequest'];
      const sortObj: Record<string, 1 | -1> = {
        [sort]: order === -1 ? -1 : 1,
      };
      const [data, total] = await Promise.all([
        this.userModel
          .find(match)
          .sort(sortObj)
          .select('-password') // Exclude password from the result
          .skip(skip)
          .limit(limit)
          .exec(),
        this.userModel.countDocuments(match).exec(),
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

  async setStep(id: string, setStepDto: SetStepDto, context: any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('userNotFound');
      user.stepRequest = setStepDto.step;

      if (setStepDto.step === UserRequestAuth.Step1) {
        user.stepAuth = UserTypeAuth.Step1;

        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'setStep1',
          admin: context.user.sub,
        });
      }

      if (setStepDto.step === UserRequestAuth.Step2) {
        user.stepAuth = UserTypeAuth.Step2;

        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'setStep2',
          admin: context.user.sub,
        });
      }

      if (setStepDto.step === UserRequestAuth.RejectStep1) {
        user.reason = setStepDto.reason;

        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'rejectStep1',
          admin: context.user.sub,
        });
      }

      if (setStepDto.step === UserRequestAuth.RejectStep2) {
        user.reason = setStepDto.reason;

        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'rejectStep2',
          admin: context.user.sub,
        });
      }

      await user.save();

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeStep(
    id: string,
    changeStepUserDto: ChangeStepUserDto,
    context: any,
  ) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('userNotFound');
      user.stepAuth = changeStepUserDto.step;

      if (changeStepUserDto.step === UserTypeAuth.Step1) {
        user.stepRequest = UserRequestAuth.Step1;
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'changeUserStep1',
          admin: context.user.sub,
        });
      }

      if (changeStepUserDto.step === UserTypeAuth.Step2) {
        user.stepRequest = UserRequestAuth.Step2;
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'changeUserStep2',
          admin: context.user.sub,
        });
      }

      if (changeStepUserDto.step === UserTypeAuth.None) {
        user.stepRequest = UserRequestAuth.None;
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'changeUserNone',
          admin: context.user.sub,
        });
      }

      await user.save();

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changeStatus(
    id: string,
    changeStatusUserDto: ChangeStatusUserDto,
    context: any,
  ) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('userNotFound');
      user.status = changeStatusUserDto.status;

      if (changeStatusUserDto.status == UserStatus.Rejected) {
        user.reason = changeStatusUserDto.reason;

        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'rejectStatusUser',
          admin: context.user.sub,
        });
      }

      if (user.status === UserStatus.Approved) {
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'approveStatusUser',
          admin: context.user.sub,
        });
      }

      if (user.status === UserStatus.Trusted) {
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'trustStatusUser',
          admin: context.user.sub,
        });
      }

      if (user.status === UserStatus.Blocked) {
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'blockStatusUser',
          admin: context.user.sub,
        });
      }

      if (user.status === UserStatus.Deleted) {
        await this.messageService.sendMessage({
          ip: context.ip ? context.ip : '',
          userAgent: context.userAgent ? context.userAgent : '',
          user: user,
          code: 'deleteStatusUser',
          admin: context.user.sub,
        });
      }

      await user.save();

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateAdmin(
    id: string,
    updateAdminUserDto: UpdateAdminUserDto,
    context: any,
  ) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('userNotFound');
      if (updateAdminUserDto.password) {
        updateAdminUserDto.password = await bcrypt.hash(
          `${updateAdminUserDto.password}`,
          10,
        );
      }

      if (updateAdminUserDto.nationalCode) {
        let userNationalCode = await this.userModel.findOne({
          nationalCode: updateAdminUserDto.nationalCode,
          _id: {
            $ne: user._id,
          },
          status: {
            $nin: [UserStatus.Deleted],
          },
        });
        if (userNationalCode) {
          throw new BadRequestException('nationalAlreadyExists');
        }
      }

      user.set({ ...updateAdminUserDto });
      await user.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addNoteAdmin(id: string, addNoteUserDto: AddNoteUserDto, context: any) {
    try {
      return this.userModel
        .findByIdAndUpdate(
          id,
          { $push: { notes: addNoteUserDto.note } },
          { new: true },
        )
        .exec();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async loginWithGoogle(code: string, context: any): Promise<LoginResponse> {
    try {
      // 📌 تبادل code → token
      const { tokens } = await this.oauthClient.getToken(code);

      if (!tokens.id_token) {
        throw new NotFoundException('userNotFound');
      }

      // 📌 تایید و گرفتن اطلاعات کاربر
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new NotFoundException('userNotFound');

      const googleId = payload.sub;
      const email = payload.email;
      const name = payload.name;
      const picture = payload.picture;

      // 📌 چک کن آیا کاربر قبلاً وجود داشته؟
      let user = await this.userModel.findOne({
        $or: [{ googleId }, { email }],
        status: { $ne: UserStatus.Deleted },
      });

      if (!user) {
        const uid = await this.createUniqueUID();
        user = new this.userModel({
          googleId,
          email,
          firstName: name || null,
          imagePath: picture || '/public/admin/images/user.png',
          isActive: true,
          isEmailVerified: payload.email_verified ?? false, // چون گوگل ایمیل رو تایید می‌کنه
          uid,
        });
        await user.save();
        const code = await this.createUniqueUID();
        await this._createDefaultReferral((user as any)._id as string, code);
        await (user as any).save();
      } else {
        user.googleId = googleId;
        user.imagePath = picture || '/public/admin/images/user.png';
        await user.save();
        this._checkUserStatus(user as any);
      }

      const token = await this._generateJwtToken((user as any).toObject());
      const userJson = (user as any).toJSON(); // Convert to JSON after all DB operations on 'user' might be done

      const invitedCount = await this.getInvitedCount({ user: userJson._id });
      const level = await this.setLevel(invitedCount, userJson); // setLevel expects user object, not just ID

      return this._prepareSuccessResponse(
        userJson,
        token,
        level,
        false,
        context,
      );
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { message: ['Invalid Google token'], success: false },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async count() {
    const totalUsers = await this.userModel.countDocuments();
    const verifiedUsers = await this.userModel.countDocuments({
      $or: [{ status: UserStatus.Approved }, { status: UserStatus.Trusted }],
    });
    return {
      totalUsers: {
        title: 'تعداد کاربران',
        value: totalUsers,
      },
      verifiedUsers: {
        title: 'تعداد کاربران احراز شده',
        value: verifiedUsers,
      },
      unverifiedUsers: {
        title: 'تعداد کاربران احراز نشده',
        value: totalUsers - verifiedUsers,
      },
    };
  }

  async onModuleInit() {
    this._settings = await this.settingService.getSettings();
  }
}
