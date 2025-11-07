import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdminRole } from '../enums/AdminRole.enum';
import { AdminStatus } from '../enums/AdminStatus.enum';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ default: null, trim: true })
  firstName: string;

  @Prop({ default: null, trim: true })
  lastName: string;

  @Prop({ unique: true, index: true, sparse: true, trim: true })
  email: string;

  @Prop({ unique: true, index: true, sparse: true, trim: true })
  mobile: string;

  @Prop({ required: true }) // حذف trim چون password هش میشه
  password: string;

  @Prop({ default: null, index: true }) // برای sort و گزارش‌گیری
  lastActiveAt: Date;

  @Prop({
    type: String,
    enum: AdminRole,
    default: AdminRole.Moderator,
    index: true,
  })
  type: AdminRole;

  @Prop({ default: '/public/admin/images/admin.png', trim: true })
  imagePath: string;

  @Prop({
    type: String,
    enum: AdminStatus,
    default: AdminStatus.Active,
    index: true,
  })
  status: AdminStatus;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// ایندکس‌های ترکیبی برای بهبود کوئری‌های پرتکرار
AdminSchema.index({ firstName: 1, lastName: 1 });
AdminSchema.index({ createdAt: -1 });
AdminSchema.index({ email: 1, status: 1 });
AdminSchema.index({ type: 1, status: 1 });
