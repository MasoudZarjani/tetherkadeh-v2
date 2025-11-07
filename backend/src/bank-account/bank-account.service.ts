import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BankAccount,
  BankAccountDocument,
} from './entities/bank-account.entity';
import mongoose, { Model } from 'mongoose';
import { MessageService } from 'src/message/message.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { BankAccountStatus } from './enums/BankAccountStatus.enum';
import * as msg from '../utils/messages.json';
import { JibitService } from 'src/helpers/jibit/jibit.service';
import { ListBankAccountDto } from './dto/list-bank-account.dto';
import { UserService } from 'src/user/user.service';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class BankAccountService implements OnModuleInit {
  private _settings: any;

  constructor(
    @InjectModel(BankAccount.name)
    private bankAccountModel: Model<BankAccountDocument>,
    private userService: UserService,
    private messageService: MessageService,
    private readonly settingService: SettingService,
    private jibitService: JibitService,
  ) {}

  async add(data: CreateBankAccountDto, context: any) {
    try {
      const { user }: any = await this.userService.getUserById(
        context.user._id,
      );

      if (user.stepAuth === 'None')
        throw new BadRequestException('authenticationInformationNotComplete');

      let existingAccount = await this.bankAccountModel.findOne({
        cardNumber: data.cardNumber.trim(),
        status: BankAccountStatus.Active,
      });
      if (existingAccount)
        throw new BadRequestException('cardNumberAlreadyExists');

      if (this._settings.jibitActive) {
        const isValid = await this.jibitService.validateCardOwnership(
          data.cardNumber,
          user,
        );
        console.log(isValid);
        if (!isValid) {
          throw new BadRequestException(
            'notMatchedNationalIdentityWithCardBank',
          );
        }

        const dataInfo = await this.jibitService.fetchIbanInfo(data.cardNumber);
        if (!dataInfo.ibanInfo) {
          throw new BadRequestException(
            'notMatchedNationalIdentityWithCardBank',
          );
        }
        let shebaNumber = dataInfo.ibanInfo.iban || null;
        let accountNumber = dataInfo.ibanInfo.depositNumber || null;
        let name = dataInfo.ibanInfo.bank || null;

        await new this.bankAccountModel({
          cardNumber: data.cardNumber,
          shebaNumber,
          accountNumber,
          name,
          status: BankAccountStatus.Active,
          user: context.user._id,
        }).save();
      } else {
        await new this.bankAccountModel({
          ...data,
          user: context.user._id,
        }).save();
      }

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: user,
        code: 'addBankAccount',
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAllByUser(userId: string) {
    try {
      const match: any = {
        user: userId,
        status: { $ne: BankAccountStatus.Deleted },
      };
      const [data, total] = await Promise.all([
        this.bankAccountModel.find(match).sort({ createdAt: -1 }).exec(),
        this.bankAccountModel.countDocuments(match).exec(),
      ]);
      return {
        data,
        total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findByAdmin(userId: string, listBankAccountDto: ListBankAccountDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
      } = listBankAccountDto;
      const match: any = {
        user: userId,
        status: { $ne: BankAccountStatus.Deleted },
      };
      if (search) {
        const regex = new RegExp(search, 'i');
        match.$or = [
          { cardNumber: regex },
          { shebaNumber: regex },
          { accountNumber: regex },
          { name: regex },
        ];
      }
      const skip = (page - 1) * limit;
      const sortObj: Record<string, 1 | -1> = {
        [sort]: order === -1 ? -1 : 1,
      };
      const [data, total] = await Promise.all([
        this.bankAccountModel
          .find(match)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .exec(),
        this.bankAccountModel.countDocuments(match).exec(),
      ]);
      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findById(bankAccountId: string, userId: string) {
    return this.bankAccountModel.findOne({
      user: userId,
      _id: bankAccountId,
    });
  }

  async onModuleInit() {
    this._settings = await this.settingService.getSettings();
  }
}
