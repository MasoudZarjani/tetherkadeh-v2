import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as msg from '../utils/messages.json';
import * as he from 'he';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageType } from './enums/MessageType.enum';
import { SenderType } from './enums/SenderType.enum';
import querystring from 'querystring';
import _ from 'lodash';
import { SettingService } from 'src/setting/setting.service';

let lang = 'fa';

@Injectable()
export class MessageService implements OnModuleInit {
  private _settings: any;

  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private readonly settingService: SettingService,
  ) {}

  async createMessage(data: CreateMessageDto) {
    let message: any = await new this.messageModel({
      ...data,
    }).save();
    return {
      data: message,
      status: HttpStatus.CREATED,
      message: msg.success,
    };
  }

  async sendMessage(data: SendMessageDto) {
    try {
      if (!this._settings?.codeMessage) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: msg.notExistThisCode,
        };
      }
      if (
        this._settings.codeMessage[data.code]['type'].includes('EMAIL') &&
        data.user.email
      ) {
        const decodedTemplate = he.decode(
          this._settings.codeMessage[data.code]['emailTemplate'][lang],
        );
        const template = handlebars.compile(decodedTemplate);

        let htmlTemplate = template({
          logo: this._settings.backendUrl + this._settings.logo,
          title: this._settings.codeMessage[data.code]['title'][lang],
          message: this._settings.codeMessage[data.code]['message'][lang],
          ...data.dataMessage,
        });
        const transporter = nodemailer.createTransport({
          host: this._settings.smtpEmailServer,
          port: this._settings.smtpEmailPort || 465,
          secure: this._settings.smtpEmailPort == 587 ? false : true,
          requireTLS: true,
          auth: {
            user: this._settings.smtpEmailUsername,
            pass: this._settings.smtpEmailPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        const mailOptions = {
          from: this._settings.email,
          to: data.user.email,
          subject:
            this._settings?.codeMessage[data.code]['title'][lang] ||
            'صرافی تترکده',
          text: this._settings.codeMessage[data.code]['message'][lang],
          html: htmlTemplate,
        };
        transporter.sendMail(mailOptions, (error: any, info: any) => {
          if (error) {
            console.error('mail send error ', error);
          } else {
            console.log('send Mail', info);
          }
        });
      }
      if (
        this._settings.codeMessage[data.code]['type'].includes('SMS') &&
        data.user.mobile
      ) {
        await this.sendSms(
          data.user.mobile,
          this._settings.codeMessage[data.code],
          data.dataMessage,
        );
      }
      if (this._settings.codeMessage[data.code]['type'].includes('INBOXUSER')) {
        await new this.messageModel({
          userReceiver: data.user._id,
          title: this._settings.codeMessage[data.code]['title'][lang],
          text: data.message,
          type: MessageType.MessageBroadcast,
          codeMessage: data.code,
        }).save();
      }
      if (this._settings.codeMessage[data.code]['type'].includes('LOG')) {
        await new this.messageModel({
          userReceiver: data.admin ? null : data.user._id,
          adminReceiver: data.admin ? data.user._id : null,
          title: this._settings.codeMessage[data.code]['title'][lang],
          text: data.message,
          type: MessageType.Log,
          adminSender: data.admin,
          ip: data.ip ? data.ip : null,
          userAgent: data.userAgent ? data.userAgent : null,
          typeSender: SenderType.Notification,
          codeMessage: data.code,
        }).save();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendSms(mobile: string, objectCode: any, dataMessage: any) {
    try {
      if (this._settings.sendDriver === 'KAVENEGAR') {
        let counter = 1;
        let modifiedObj: any;
        if (dataMessage) {
          modifiedObj = _.mapKeys(dataMessage, (value, key) => {
            if (counter === 1) {
              return 'token';
            } else {
              counter++;
              const tokenKey = `token${counter}`;
              return tokenKey;
            }
          });
        } else {
          modifiedObj = {
            token: this._settings.emailAppName,
          };
        }

        const queryString = querystring.stringify(modifiedObj);
        console.log(
          `https://api.kavenegar.com/v1/${this._settings.tokenKavenegar}/verify/lookup.json?receptor=${mobile}&template=${objectCode['kavenegar']}&type=sms&${queryString}`,
        );
        await fetch(
          `https://api.kavenegar.com/v1/${this._settings.tokenKavenegar}/verify/lookup.json?receptor=${mobile}&template=${objectCode['kavenegar']}&type=sms&${queryString}`,
          {
            method: 'GET',
          },
        );
      }
    } catch (error) {
      console.log('error in sending sms', error);
    }
  }

  async sendTokenVerify(data: any) {
    if (data.type === 'sms') {
      await this.sendSms(data.user, data.code, 'verify');
    } else {
      await this.sendMessage(data);
    }
  }

  async sendTelegramMessage(message: string) {
    try {
      const url = `https://n8n.zar-ex.com/webhook/tetherkade/send-telegram-message`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error(
          `Error sending Telegram message: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.log('error in sending telegram message', error);
    }
  }

  async onModuleInit() {
    this._settings = await this.settingService.getSettings();
  }
}
