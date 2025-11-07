import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { TicketStatus } from '../enums/TicketStatus.enum';
import { TicketType } from '../enums/TicketType.enum';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ default: null, trim: true })
  title: string;
  @Prop({
    type: String,
    enum: TicketStatus,
    default: TicketStatus.UserCreated,
  })
  status: TicketStatus;
  @Prop({
    type: String,
    enum: TicketType,
    default: TicketType.Support,
  })
  type: TicketType;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Admin',
    default: null,
  })
  admin: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
