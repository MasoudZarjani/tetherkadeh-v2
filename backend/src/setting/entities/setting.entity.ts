import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, trim: true, unique: true })
  key: string;

  @Prop({ type: SchemaTypes.Mixed })
  value: any;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
