import { HttpStatus, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import * as msg from '../utils/messages.json';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageType } from './enums/MessageType.enum';
import { SenderType } from './enums/SenderType.enum';
import querystring from 'querystring';
import { SettingService } from 'src/setting/setting.service';
import { readFileSync } from 'fs';
import { join } from 'path';

const DEFAULT_LANG = 'fa';

@Injectable()
export class MessageService implements OnModuleInit {
  private readonly logger = new Logger(MessageService.name);
  private _settings: any;
  private transporter: nodemailer.Transporter;
  private emailTemplate: HandlebarsTemplateDelegate;

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly settingService: SettingService,
  ) {}

  async onModuleInit() {
    try {
      this._settings = await this.settingService.getSettings();
      await this.initializeEmailTransporter();
      this.loadEmailTemplate();
    } catch (error) {
      this.logger.error('Failed to initialize MessageService', error);
    }
  }

  private async initializeEmailTransporter(): Promise<void> {
    if (!this._settings?.smtpEmailServer) {
      this.logger.warn('SMTP settings not configured');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: this._settings.smtpEmailServer,
      port: this._settings.smtpEmailPort || 465,
      secure: this._settings.smtpEmailPort !== 587,
      requireTLS: true,
      auth: {
        user: this._settings.smtpEmailUsername,
        pass: this._settings.smtpEmailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      await this.transporter.verify();
      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error('Email transporter verification failed', error);
    }
  }

  private loadEmailTemplate(): void {
    try {
      const templatePath = join(process.cwd(), 'templates', 'email.hbs');
      const templateContent = readFileSync(templatePath, 'utf-8');
      this.emailTemplate = handlebars.compile(templateContent);
      this.logger.log('Email template loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load email template', error);
    }
  }

  async createMessage(data: CreateMessageDto) {
    try {
      const message = await new this.messageModel(data).save();
      return {
        data: message,
        status: HttpStatus.CREATED,
        message: msg.success,
      };
    } catch (error) {
      this.logger.error('Failed to create message', error);
      throw error;
    }
  }

  async sendMessage(data: SendMessageDto) {
    try {
      if (!this._settings?.codeMessage?.[data.code]) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: msg.notExistThisCode,
        };
      }

      const messageConfig = this._settings.codeMessage[data.code];
      const messageTypes = messageConfig.type || [];

      await Promise.allSettled([
        messageTypes.includes('EMAIL') && data.user.email
          ? this.sendEmailMessage(data, messageConfig)
          : Promise.resolve(),
        messageTypes.includes('SMS') && data.user.mobile
          ? this.sendSms(data.user.mobile, messageConfig, data.dataMessage)
          : Promise.resolve(),
        messageTypes.includes('INBOXUSER')
          ? this.createInboxMessage(data, messageConfig)
          : Promise.resolve(),
        messageTypes.includes('LOG')
          ? this.createLogMessage(data, messageConfig)
          : Promise.resolve(),
      ]);

      return {
        status: HttpStatus.OK,
        message: msg.success,
      };
    } catch (error) {
      this.logger.error('Failed to send message', error);
      throw error;
    }
  }

  private async sendEmailMessage(
    data: SendMessageDto,
    messageConfig: any,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not initialized');
      return;
    }

    if (!this.emailTemplate) {
      this.logger.error('Email template not loaded');
      return;
    }

    try {
      // فقط از تمپلیت فایل استفاده می‌کنیم
      const templateData = {
        logo: this._settings.backendUrl + this._settings.logo,
        title: messageConfig.title?.[DEFAULT_LANG] || '',
        message: messageConfig.message?.[DEFAULT_LANG] || data.message || '',
        appName: this._settings.persianEmailAppName || 'تترکده',
        year: new Date().getFullYear(),
        supportEmail: this._settings.email,
        ...data.dataMessage,
      };

      const htmlTemplate = this.emailTemplate(templateData);

      const mailOptions = {
        from: `${this._settings.persianEmailAppName || 'تترکده'} <${this._settings.email}>`,
        to: data.user.email,
        subject: messageConfig.title?.[DEFAULT_LANG] || 'صرافی تترکده',
        html: htmlTemplate,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }

  private async createInboxMessage(
    data: SendMessageDto,
    messageConfig: any,
  ): Promise<void> {
    await new this.messageModel({
      userReceiver: data.user._id,
      title: messageConfig.title?.[DEFAULT_LANG] || '',
      text: data.message,
      type: MessageType.MessageBroadcast,
      codeMessage: data.code,
    }).save();
  }

  private async createLogMessage(
    data: SendMessageDto,
    messageConfig: any,
  ): Promise<void> {
    await new this.messageModel({
      userReceiver: data.admin ? null : data.user._id,
      adminReceiver: data.admin ? data.user._id : null,
      title: messageConfig.title?.[DEFAULT_LANG] || '',
      text: data.message,
      type: MessageType.Log,
      adminSender: data.admin,
      ip: data.ip || null,
      userAgent: data.userAgent || null,
      typeSender: SenderType.Notification,
      codeMessage: data.code,
    }).save();
  }

  async sendSms(mobile: string, objectCode: any, dataMessage: any) {
    try {
      if (this._settings.sendDriver !== 'KAVENEGAR') {
        this.logger.warn('SMS driver not configured for KAVENEGAR');
        return;
      }

      const tokenParams = this.buildKavenegarTokens(dataMessage);
      const queryString = querystring.stringify(tokenParams);
      const url = `https://api.kavenegar.com/v1/${this._settings.tokenKavenegar}/verify/lookup.json?receptor=${mobile}&template=${objectCode.kavenegar}&type=sms&${queryString}`;

      this.logger.debug(`Sending SMS to ${mobile}`);

      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`SMS API returned status ${response.status}`);
      }

      this.logger.log(`SMS sent successfully to ${mobile}`);
    } catch (error) {
      this.logger.error('Failed to send SMS', error);
    }
  }

  private buildKavenegarTokens(dataMessage: any): Record<string, any> {
    if (!dataMessage || Object.keys(dataMessage).length === 0) {
      return { token: this._settings.persianEmailAppName };
    }

    const tokens: Record<string, any> = {};
    let counter = 1;

    for (const [, value] of Object.entries(dataMessage)) {
      const key = counter === 1 ? 'token' : `token${counter}`;
      tokens[key] = value;
      counter++;
    }

    return tokens;
  }

  async sendTokenVerify(data: any) {
    if (data.type === 'sms') {
      await this.sendSms(data.user, data.code, 'verify');
    } else {
      await this.sendMessage(data);
    }
  }

  async sendTelegramMessage(message: string): Promise<boolean> {
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log('Telegram message sent successfully');
      return true;
    } catch (error) {
      this.logger.error('Failed to send Telegram message', error);
      return false;
    }
  }
}
