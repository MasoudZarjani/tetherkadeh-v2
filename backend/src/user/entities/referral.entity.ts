import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true })
export class Referral {
  @Prop({ default: 0 })
  invitedCommission: number;
  @Prop({ default: 100 })
  inviterCommission: number;
  @Prop({ default: null, trim: true })
  code: string;
  @Prop({ default: true })
  isDefault: boolean;
  @Prop({ default: false })
  isMarketing: boolean;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: Types.ObjectId;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
