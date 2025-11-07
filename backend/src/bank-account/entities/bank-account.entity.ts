import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { BankAccountStatus } from '../enums/BankAccountStatus.enum';

export type BankAccountDocument = BankAccount & Document;

@Schema({ timestamps: true })
export class BankAccount {
  @Prop({ default: null, trim: true })
  name: string;
  @Prop({ default: null, trim: true })
  accountNumber: string;
  @Prop({ default: null, trim: true })
  cardNumber: string;
  @Prop({ default: null, trim: true })
  shebaNumber: string;
  @Prop({ default: null, trim: true })
  reason: string;
  @Prop({
    type: String,
    enum: BankAccountStatus,
    default: BankAccountStatus.Pending,
  })
  status: BankAccountStatus;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: Types.ObjectId;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
