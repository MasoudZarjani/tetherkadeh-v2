import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes, Types } from 'mongoose';
import { MessageStatus } from '../enums/MessageStatus.enum';
import { FileType } from '../enums/FileType.enum';
import { MessageType } from '../enums/MessageType.enum';
import { SenderType } from '../enums/SenderType.enum';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ default: null, trim: true })
  title: string;
  @Prop({ default: null, trim: true })
  text: string;
  @Prop({ default: null, trim: true })
  codeMessage: string;
  @Prop({ default: null, trim: true })
  ip: string;
  @Prop({ default: null, trim: true })
  userAgent: string;
  @Prop({ default: null, trim: true })
  fileUrl: string;
  @Prop({
    type: String,
    enum: FileType,
    default: FileType.Image,
  })
  typeFile: FileType;
  @Prop({
    type: String,
    enum: MessageStatus,
    default: MessageStatus.Unread,
  })
  status: MessageStatus;
  @Prop({
    type: String,
    enum: MessageType,
    default: MessageType.Ticket,
  })
  type: MessageType;
  @Prop({
    type: String,
    enum: SenderType,
    default: SenderType.Email,
  })
  senderType: SenderType;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  userSender: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  userReceiver: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Admin',
    default: null,
  })
  adminSender: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Admin',
    default: null,
  })
  adminReceiver: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Ticket',
    default: null,
  })
  ticket: Types.ObjectId;
  @Prop({ default: null, type: [Types.ObjectId], ref: 'User' })
  usersBroadcast: ObjectId[];
  @Prop({ default: null, type: [Types.ObjectId], ref: 'Admin' })
  adminsBroadcast: ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
