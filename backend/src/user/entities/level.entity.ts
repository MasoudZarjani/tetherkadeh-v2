import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { LevelStatus } from '../enums/LevelStatus.enum';
import { LevelType } from '../enums/LevelType.enum';

export type LevelDocument = Level & Document;

@Schema({ timestamps: true })
export class Level {
  @Prop({ default: null, trim: true })
  title: string;
  @Prop({ default: null, trim: true })
  description: string;
  @Prop({ default: 1, trim: true })
  level: number;
  @Prop({ default: null, trim: true })
  commission: number;
  @Prop({ default: null, trim: true })
  feeBuy: number;
  @Prop({ default: null, trim: true })
  feeSell: number;
  @Prop({ default: null, trim: true })
  isVolumeTransaction: boolean;
  @Prop({ default: null, trim: true })
  fromVolumeTransaction: number;
  @Prop({ default: null, trim: true })
  toVolumeTransaction: number;
  @Prop({ default: null, trim: true })
  isInvited: boolean;
  @Prop({ default: null, trim: true })
  fromInvited: number;
  @Prop({ default: null, trim: true })
  toInvited: number;
  @Prop({
    type: String,
    enum: LevelStatus,
    default: LevelStatus.Active,
  })
  status: LevelStatus;
  @Prop({
    type: String,
    enum: LevelType,
    default: LevelType.Commission,
  })
  type: LevelType;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
