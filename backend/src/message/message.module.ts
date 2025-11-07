import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { AdminModule } from 'src/admin/admin.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
    AdminModule,
    SettingModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
