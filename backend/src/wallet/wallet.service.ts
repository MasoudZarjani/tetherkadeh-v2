import {
  BadRequestException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ChargeWalletDto } from './dto/charge-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import mongoose, { Model, Types } from 'mongoose';
import { MessageService } from 'src/message/message.service';
import { WalletStatus } from './enums/WalletStatus.enum';
import * as msg from '../utils/messages.json';
import { SymbolService } from 'src/symbol/symbol.service';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';
import { WalletType } from './enums/WalletType.enum';
import { NetworkService } from 'src/network/network.service';
import { VerifyWithdrawDto } from './dto/verify-withdraw.dto';
import { WalletBlockType } from './enums/WalletBlockType.enum';
import { WalletTransactionType } from './enums/WalletTransactionType';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { BankAccountService } from 'src/bank-account/bank-account.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { UserService } from 'src/user/user.service';
import { DepositRequestDto } from './dto/deposit-request.dto';
import { TransactionDto } from './dto/transaction.dto';
import { ListWalletAdminDto } from './dto/list-wallet-admin.dto';
import { ChangeStatusWalletDto } from './dto/change-status-wallet.dto';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class WalletService implements OnModuleInit {
  private _settings: any;

  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    private messageService: MessageService,
    private symbolService: SymbolService,
    private networkService: NetworkService,
    private bankAccountService: BankAccountService,
    private userService: UserService,
    private readonly settingService: SettingService,
  ) {}

  async create(data: ChargeWalletDto, context: any) {
    try {
      const symbol = await this.symbolService.findBySymbol(data.coin);
      if (!symbol) {
        throw new BadRequestException('symbolNotFound');
      }
      const userInfo = await this.userService.findOne(data.userId);
      if (!userInfo) throw new UnauthorizedException('userNotFound');
      const code = Math.random().toString(36).substring(2, 15);
      await new this.walletModel({
        status: WalletStatus.Active,
        user: data.userId,
        coin: data.coin,
        transactionType: data.transactionType,
        amount: data.amount,
        type: data.type,
        originalPrice: 1,
        priceFiat: symbol?.last ?? 0,
        reason: data.reason,
        trackingCode: code,
        transactionId: code,
        isManual:
          data.transactionType === WalletTransactionType.Manual ? true : false,
      }).save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'chargeWallet',
        admin: context.user._id,
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async inventory(userId: string) {
    try {
      const symbol = await this.symbolService.findBySymbol('USDT');
      const priceFiat = symbol?.last ?? 0;
      let result = await this.walletModel.aggregate([
        {
          $match: {
            user: new Types.ObjectId(userId),
            status: WalletStatus.Active,
          },
        },
        {
          $group: {
            _id: '$coin',
            totalDeposit: {
              $sum: {
                $cond: [{ $eq: ['$type', 'Deposit'] }, '$amount', 0],
              },
            },
            totalWithdraw: {
              $sum: {
                $cond: [{ $eq: ['$type', 'Withdraw'] }, '$amount', 0],
              },
            },
            totalBlocked: {
              $sum: {
                $cond: [{ $eq: ['$type', 'Blocked'] }, '$amount', 0],
              },
            },
            totalDepositIRT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Deposit'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'USDT'] },
                      { $multiply: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            totalWithdrawIRT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Withdraw'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'USDT'] },
                      { $multiply: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            totalBlockedIRT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Blocked'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'USDT'] },
                      { $multiply: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            totalDepositUSDT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Deposit'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'IRT'] },
                      { $divide: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            totalWithdrawUSDT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Withdraw'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'IRT'] },
                      { $divide: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            totalBlockedUSDT: {
              $sum: {
                $cond: [
                  { $eq: ['$type', 'Blocked'] },
                  {
                    $cond: [
                      { $eq: ['$coin', 'IRT'] },
                      { $divide: ['$amount', priceFiat] },
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            coin: '$_id',
            totalDeposit: 1,
            totalWithdraw: 1,
            totalBlocked: 1,
            totalDepositIRT: 1,
            totalWithdrawIRT: 1,
            totalBlockedIRT: 1,
            totalDepositUSDT: 1,
            totalWithdrawUSDT: 1,
            totalBlockedUSDT: 1,
            totalUSDT: {
              $subtract: [
                {
                  $sum: ['$totalDepositUSDT', 'totalBlockedUSDT'],
                },
                '$totalWithdrawUSDT',
              ],
            },
            totalIRT: {
              $subtract: [
                {
                  $sum: ['$totalDepositIRT', 'totalBlockedIRT'],
                },
                '$totalWithdrawIRT',
              ],
            },
          },
        },
      ]);
      return {
        data: result,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async withdraw(withdrawRequestDto: WithdrawRequestDto, context: any) {
    try {
      const accessAmount = await this.accessAmountWithCoin(
        context.user,
        withdrawRequestDto.coin,
      );
      const userInfo = await this.userService.findOne(context.user._id);
      if (!userInfo) throw new UnauthorizedException('userNotFound');
      if (accessAmount < withdrawRequestDto.amount)
        throw new BadRequestException('notEnoughInventory');
      let priceInBase = 0;
      let fee = 0;
      if (withdrawRequestDto.coin === 'IRT') {
        const bankAccount = await this.bankAccountService.findById(
          withdrawRequestDto.bankAccount,
          context.user._id,
        );
        if (!bankAccount)
          throw new BadRequestException('notExistBankAccount');

        priceInBase = withdrawRequestDto.amount;
        const calc = (withdrawRequestDto.amount * 0.02) / 100;
        if (calc > 15000) fee = 15000;
        else if (calc < 7000) fee = 7000;
        else fee = calc;
      } else {
        const symbol = await this.symbolService.findBySymbol('USDT');
        priceInBase = withdrawRequestDto.amount * (symbol?.last ?? 0);
        const network = await this.networkService.findById(
          withdrawRequestDto.network,
        );
        if (!network) throw new BadRequestException('networkNotFound');
        fee = network?.withdrawFee ?? 0;
      }
      const checkMinLimitWithdraw =
        await this.checkMinLimitWithdraw(withdrawRequestDto);
      if (!checkMinLimitWithdraw)
        throw new BadRequestException('minWithdrawRequest');
      const checkMaxLimitWithdraw = await this.checkMaxLimitWithdraw(
        userInfo.stepAuth,
        priceInBase,
      );
      if (!checkMaxLimitWithdraw)
        throw new BadRequestException('withdrawMoreThanTheAllowedLimit');
      const code = Math.floor(100000 + Math.random() * 900000);

      const wallet = await new this.walletModel({
        user: context.user._id,
        fee,
        ...withdrawRequestDto,
        priceFiat: priceInBase,
        type: WalletType.Withdraw,
        status: WalletStatus.Inactive,
        transactionType:
          withdrawRequestDto.coin === 'IRT'
            ? WalletTransactionType.Payment
            : WalletTransactionType.Coin,
        verifyCode: code,
        reason: 'درخواست برداشت',
      }).save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'requestWithdrawCode',
        dataMessage: {
          code: code.toString(),
        },
      });

      await this.messageService.sendTelegramMessage(
        `یک درخواست برداشت به مبلغ ${withdrawRequestDto.amount} از کاربر ${userInfo.firstName} ${userInfo.lastName} با شماره کاربری ${userInfo.uid} ثبت شده است.`,
      );

      return {
        walletId: wallet._id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async accessAmountWithCoin(user: any, coin: string) {
    const inventory = await this.inventory(user._id);
    if (inventory.data.length === 0) return 0;
    const availableAmount = inventory.data?.find(
      (element: any) => element.coin === coin,
    );
    return (
      availableAmount?.totalDeposit -
      (availableAmount?.totalWithdraw + availableAmount?.totalBlocked)
    );
  }

  async checkMaxLimitWithdraw(userStepAuth: string, priceInBase: number) {
    const withdrawTrusted = parseFloat(this._settings.withdrawTrusted);
    const withdrawApproved = parseFloat(this._settings.withdrawApproved);
    if (userStepAuth === 'Step1') {
      if (withdrawApproved < priceInBase) {
        return false;
      }
    }
    if (userStepAuth === 'Step2') {
      if (withdrawTrusted < priceInBase) {
        return false;
      }
    }

    return true;
  }

  async checkMaxLimitDeposit(status: string, amount: number) {
    const depositTrusted = parseFloat(this._settings.depositTrusted);
    const depositApproved = parseFloat(this._settings.depositApproved);
    if (status === 'Approved') {
      if (depositApproved < amount) {
        return false;
      }
    }
    if (status === 'Trusted') {
      if (depositTrusted < amount) {
        return false;
      }
    }

    return true;
  }

  async checkMinLimitWithdraw(withdrawRequestDto: WithdrawRequestDto) {
    let minWithdraw = 0;
    if (withdrawRequestDto.coin === 'IRT') {
      minWithdraw = 200000;
    } else {
      const network = await this.networkService.findById(
        withdrawRequestDto.network,
      );
      minWithdraw =
        network?.withdrawFee !== undefined ? network.withdrawFee : 0;
    }
    if (minWithdraw > withdrawRequestDto.amount) {
      return false;
    }
    return true;
  }

  async verifyWithdraw(verifyWithdrawDto: VerifyWithdrawDto, context: any) {
    try {
      const wallet = await this.walletModel.findOne({
        _id: verifyWithdrawDto.walletId,
        user: context.user._id,
        status: WalletStatus.Inactive,
        verifyCode: verifyWithdrawDto.code,
      });
      if (!wallet)
        throw new BadRequestException('theWithdrawalRequestCodeIsNotCorrect');

      const userInfo = await this.userService.findOne(context.user._id);
      if (!userInfo) throw new UnauthorizedException('userNotFound');

      const walletBlock = await new this.walletModel({
        coin: wallet.coin,
        amount: wallet.amount,
        priceFiat: wallet.priceFiat,
        fee: wallet.fee,
        address: wallet.address,
        destinationTag: wallet.destinationTag,
        user: context.user._id,
        type: WalletType.Blocked,
        blockedFor: WalletBlockType.Payment,
        reason: 'تکمیل برداشت',
      }).save();
      wallet.status = WalletStatus.Pending;
      wallet.wallet = walletBlock._id as mongoose.Types.ObjectId;
      await wallet.save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'verifyWithdraw',
      });

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async payment(paymentRequestDto: PaymentRequestDto, context: any) {
    const bankAccount = await this.bankAccountService.findById(
      paymentRequestDto.bankAccount,
      context.user._id,
    );
    const userInfo = await this.userService.findOne(context.user._id);
    if (!userInfo) throw new UnauthorizedException('userNotFound');

    if (!bankAccount) throw new BadRequestException('notExistBankAccount');

    if (paymentRequestDto.amount < 500000)
      throw new BadRequestException('theValueCannotBeLessThan');

    const checkMaxLimitDeposit = await this.checkMaxLimitDeposit(
      userInfo.status,
      paymentRequestDto.amount,
    );
    if (!checkMaxLimitDeposit)
      throw new BadRequestException('depositMoreThanTheAllowedLimit');

    const token = Math.random().toString(36).substring(2, 15);
    const callbackUrl = `https://giftime.ir/verify-payment.php`;

    try {
      const resp = await fetch(`https://gateway.zibal.ir/v1/request`, {
        method: 'POST',
        body: JSON.stringify({
          amount: paymentRequestDto.amount * 10,
          merchant: '63f3789018f9344cf072bf04',
          callbackUrl,
          description: 'واریز وجه',
          allowedCards: [bankAccount.cardNumber],
          nationalCode: userInfo.nationalCode,
          mobile: userInfo.mobile,
          checkMobileWithCard: true,
          orderId: token,
          blockedFor: WalletBlockType.Payment,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const dataInfo = await resp.json();
      if (dataInfo.result !== 100)
        throw new BadRequestException('problemPayment');

      await new this.walletModel({
        status: WalletStatus.Pending,
        user: context.user._id,
        coin: paymentRequestDto.coin,
        transactionType: WalletTransactionType.Payment,
        amount: paymentRequestDto.amount,
        bankAccount: bankAccount ? bankAccount._id : null,
        type: WalletType.Deposit,
        blockedFor: WalletBlockType.Payment,
        gateway: 'زیبال',
        token,
        trackingCode: dataInfo.trackId,
        reason: 'واریز از درگاه',
      }).save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'addPayment',
      });

      return {
        url: `https://gateway.zibal.ir/start/${dataInfo.trackId}`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const wallet = await this.walletModel
      .findOne({
        trackingCode: verifyPaymentDto.trackId,
        status: WalletStatus.Pending,
      })
      .populate('bankAccount');
    try {
      if (!wallet) {
        return {
          success: false,
          token: verifyPaymentDto.trackId,
          frontUrl: this._settings.frontUrl,
        };
      }

      const user = await this.userService.findOne(wallet.user.toString());
      if (!user)
        return {
          success: false,
          token: verifyPaymentDto.trackId,
          frontUrl: this._settings.frontUrl,
        };
      const resp = await fetch(`https://gateway.zibal.ir/v1/verify`, {
        method: 'POST',
        body: JSON.stringify({
          trackId: verifyPaymentDto.trackId,
          merchant: '63f3789018f9344cf072bf04',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const dataInfo = await resp.json();
      if (dataInfo.result !== 100) {
        wallet.status = WalletStatus.Rejected;
        await wallet.save();
        await this.messageService.sendMessage({
          ip: '',
          userAgent: '',
          user: user,
          code: 'rejectedPayment',
        });
        return {
          success: false,
          token: verifyPaymentDto.trackId,
          frontUrl: this._settings.frontUrl,
        };
      }
      wallet.status = WalletStatus.Active;
      wallet.transactionId = verifyPaymentDto.trackId;
      await wallet.save();
      await this.messageService.sendMessage({
        ip: '',
        userAgent: '',
        user: user,
        code: 'depositPayment',
      });
      await this.messageService.sendTelegramMessage(
        `یک واریز جدید به مبلغ ${wallet.amount} از کاربر ${user.firstName} ${user.lastName} با شماره کاربری ${user.uid} ثبت شده است.`,
      );
      return {
        token: wallet.trackingCode,
        frontUrl: this._settings.frontUrl,
        success: true,
      };
    } catch (error) {
      console.log(error);
      if (wallet) {
        wallet.status = WalletStatus.Rejected;
        await wallet.save();
      }
      throw error;
    }
  }

  async deposit(depositRequestDto: DepositRequestDto, context: any) {
    try {
      const network = await this.networkService.findById(
        depositRequestDto.network,
      );
      if (!network) throw new BadRequestException('networkNotFound');

      const symbol = await this.symbolService.findBySymbol('USDT');

      const userInfo = await this.userService.findOne(context.user._id);
      if (!userInfo) throw new UnauthorizedException('userNotFound');

      await new this.walletModel({
        status: WalletStatus.Pending,
        user: context.user._id,
        ...depositRequestDto,
        transactionType: WalletTransactionType.Coin,
        type: WalletType.Deposit,
        reason: 'واریز ارزی',
        priceFiat: depositRequestDto.amount * (symbol?.last ?? 0),
      }).save();

      await this.messageService.sendMessage({
        ip: context.ip,
        userAgent: context.userAgent,
        user: userInfo,
        code: 'addPayment',
      });
      await this.messageService.sendTelegramMessage(
        `یک واریز ارزی جدید به مبلغ ${depositRequestDto.amount} از کاربر ${userInfo.firstName} ${userInfo.lastName} با شماره کاربری ${userInfo.uid} ثبت شده است.`,
      );

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async transactions(transactionDto: TransactionDto, userId: string) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'createdAt',
        order = -1,
        type = 'all',
      } = transactionDto;
      const skip = (page - 1) * limit;
      let query = {};
      if (search) {
        const regex = new RegExp(search, 'i'); // i برای case-insensitive
        query = {
          $or: [{ coin: regex }, { transactionId: regex }, { address: regex }],
        };
      }
      let match: any = {
        user: new Types.ObjectId(userId),
        type,
        ...query,
      };
      if (type === 'all') delete match['type'];
      const sortObj: Record<string, 1 | -1> = {
        [sort]: order === -1 ? -1 : 1,
      };
      const [data, total] = await Promise.all([
        this.walletModel
          .find(match)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .populate(['network', 'bankAccount'])
          .exec(),
        this.walletModel.countDocuments(match).exec(),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(listWalletAdminDto: ListWalletAdminDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = -1,
      userId,
      type = 'all',
      transactionType = 'all',
    } = listWalletAdminDto;

    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = {
        $or: [{ price: regex }, { amount: regex }, { trackId: regex }],
      };
    }
    let match: any = {
      type,
      transactionType,
      user: userId,
      ...query,
    };

    if (!userId) delete match['user'];
    if (type === 'all') delete match['type'];
    if (transactionType === 'all') delete match['transactionType'];

    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === -1 ? -1 : 1,
    };
    const [data, total] = await Promise.all([
      this.walletModel
        .find(match)
        .sort(sortObj)
        .populate(['bankAccount', 'user', 'network'])
        .skip(skip)
        .limit(limit)
        .exec(),
      this.walletModel.countDocuments(match).exec(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async changeStatus(
    changeStatusWalletDto: ChangeStatusWalletDto,
    context: any,
  ) {
    try {
      const wallet = await this.walletModel.findById(
        changeStatusWalletDto.walletId,
      );
      if (!wallet) throw new BadRequestException('walletNotFound');
      const user = await this.userService.findOne(wallet.user.toString());
      if (!user) throw new BadRequestException('userNotFound');
      wallet.set({ ...changeStatusWalletDto });
      await wallet.save();
      if (wallet.type == WalletType.Withdraw && wallet.wallet != null) {
        const blockedWallet = await this.walletModel.findOne({
          _id: wallet.wallet,
        });
        if (blockedWallet) {
          blockedWallet.status = WalletStatus.Deleted;
          await blockedWallet.save();
        }
      }
      if (wallet.status == WalletStatus.Rejected) {
        await this.messageService.sendMessage({
          ip: '',
          userAgent: '',
          user: user,
          code: 'rejectTransaction',
          admin: context.user._id,
        });
      }
      if (wallet.status == WalletStatus.Active) {
        await this.messageService.sendMessage({
          ip: '',
          userAgent: '',
          user: user,
          code: 'acceptTransaction',
          admin: context.user._id,
        });
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async depositCount(userId: string) {
    return this.walletModel.countDocuments({
      user: userId,
      type: WalletType.Deposit,
      status: WalletStatus.Active,
    });
  }

  async withdrawalCount(userId: string) {
    return this.walletModel.countDocuments({
      user: userId,
      type: WalletType.Withdraw,
      status: WalletStatus.Active,
    });
  }

  async onModuleInit() {
    this._settings = await this.settingService.getSettings();
  }
}
