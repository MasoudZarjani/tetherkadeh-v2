import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { AnnouncementImportance } from '../enums/AnnouncementImportance.enum';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ default: null, trim: true })
  title: string;
  @Prop({ default: null, trim: true })
  body: string;
  @Prop({ default: false, trim: true })
  status: boolean;
  @Prop({
    type: String,
    enum: AnnouncementImportance,
    default: AnnouncementImportance.Info,
    index: true,
  })
  importance: AnnouncementImportance;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
