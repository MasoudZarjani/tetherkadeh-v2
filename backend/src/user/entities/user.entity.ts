import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from '../enums/UserStatus.enum';
import { UserTypeAuth } from '../enums/UserTypeAuth.enum';
import { UserRequestAuth } from '../enums/UserRequestAuth.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: null, trim: true })
  firstName: string;
  @Prop({ default: null, trim: true })
  lastName: string;
  @Prop({ default: null, trim: true })
  email: string;
  @Prop({ default: null, trim: true })
  mobile: string;
  @Prop({ default: null, trim: true })
  password: string;
  @Prop({ default: null, trim: true })
  googleId: string;
  @Prop({ default: null, trim: true })
  googleAccessToken: string;
  @Prop({ default: null, trim: true })
  googleRefreshToken: string;
  @Prop({ default: 0 })
  token: number;
  @Prop({ default: false })
  isMobileVerified: boolean;
  @Prop({ default: false })
  isEmailVerified: boolean;
  @Prop({ default: null, trim: true })
  lastActiveAt: Date;
  @Prop({ default: null, trim: true })
  imagePath: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: null, trim: true })
  invitationCode: string;
  @Prop({ default: null, trim: true })
  invitedBy: string;
  @Prop({ default: null, trim: true })
  nationalCode: string;
  @Prop({ default: null, trim: true })
  reason: string;
  @Prop({ default: null })
  birthday: Date;
  @Prop({ default: null, trim: true })
  address: string;
  @Prop({ default: null, trim: true })
  postalCode: string;
  @Prop({ default: null, trim: true })
  phone: string;
  @Prop({ default: false })
  twoStepVerification: boolean;
  @Prop({ default: false })
  twoFactorVerification: boolean;
  @Prop({ default: null, trim: true })
  token2FV: string;
  @Prop({ default: null, trim: true })
  uid: string;
  @Prop({
    type: [],
    default: [],
  })
  docs: [];
  @Prop({ type: [], default: [] })
  notes: string[];
  @Prop({
    type: String,
    enum: UserStatus,
    default: UserStatus.Register,
  })
  status: UserStatus;
  @Prop({
    type: String,
    enum: UserTypeAuth,
    default: UserTypeAuth.None,
  })
  stepAuth: UserTypeAuth;
  @Prop({
    type: String,
    enum: UserRequestAuth,
    default: UserRequestAuth.None,
  })
  stepRequest: UserRequestAuth;
  @Prop({ default: null, trim: true })
  sendMailAt: Date;
  @Prop({ default: null })
  withdrawalTimeLimit: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
