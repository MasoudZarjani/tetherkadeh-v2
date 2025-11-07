import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './entities/order.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as msg from '../utils/messages.json';
import { WalletService } from 'src/wallet/wallet.service';
import { SymbolService } from 'src/symbol/symbol.service';
import { OrderSide } from './enums/OrderSide.enum';
import { WalletTransactionType } from 'src/wallet/enums/WalletTransactionType';
import { WalletType } from 'src/wallet/enums/WalletType.enum';
import { ListOrderDto } from './dto/list-order.dto';
import { generateTrackingCode } from 'src/common/utils/generate-tracking-code';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    private walletService: WalletService,
    private symbolService: SymbolService,
  ) {}

  async create(createOrderDto: CreateOrderDto, context: any) {
    try {
      const symbol = await this.symbolService.findBySymbol('USDT');
      if (!symbol) throw new BadRequestException('symbolNotFound');
      const pairSymbol = await this.symbolService.findBySymbol('IRT');
      if (!pairSymbol) throw new BadRequestException('symbolNotFound');
      const wallet = await this.walletService.inventory(context.user._id);
      if (wallet.data.length === 0)
        throw new BadRequestException('notEnoughInventory');
      let lastPrice = 0;
      let payloadIncrease: any = {};
      let payloadDecrease: any = {};
      if (createOrderDto.side === OrderSide.Buy) {
        const lastBuy =
          (symbol.last + symbol.buyingPriceGap) *
          (1 + symbol.buyingPriceGapPercentage / 100);
        lastPrice = lastBuy;
        const walletIRT = wallet.data?.find((item: any) => item.coin === 'IRT');
        const inventory = walletIRT.totalIRT - walletIRT.totalBlockedIRT;
        if (inventory < createOrderDto.amount * lastPrice)
          throw new BadRequestException('notEnoughInventory');
        payloadIncrease = {
          coin: 'USDT',
          transactionType: WalletTransactionType.Order,
          type: WalletType.Deposit,
          reason: 'خرید تتر',
          userId: context.user._id,
          amount: createOrderDto.amount,
          side: createOrderDto.side,
          pairSymbol: 'IRT',
          priceFiat: lastPrice,
        };
        payloadDecrease = {
          coin: 'IRT',
          transactionType: WalletTransactionType.Order,
          type: WalletType.Withdraw,
          reason: 'تبدیل به تتر',
          userId: context.user._id,
          amount: createOrderDto.amount * lastBuy,
          side: createOrderDto.side,
          pairSymbol: 'USDT',
          priceFiat: 1,
        };
      } else {
        const lastSell =
          (symbol.last - symbol.sellingPriceGap) *
          (1 - symbol.sellingPriceGapPercentage / 100);
        lastPrice = lastSell;
        const walletUSDT = wallet.data?.find(
          (item: any) => item.coin === 'USDT',
        );
        const inventory = walletUSDT.totalUSDT - walletUSDT.totalBlockedUSDT;
        if (inventory < createOrderDto.amount)
          throw new BadRequestException('notEnoughInventory');

        payloadIncrease = {
          coin: 'IRT',
          transactionType: WalletTransactionType.Order,
          type: WalletType.Deposit,
          reason: 'فروش تتر',
          userId: context.user._id,
          amount: createOrderDto.amount * lastSell,
          side: createOrderDto.side,
          pairSymbol: 'USDT',
          priceFiat: 1,
        };
        payloadDecrease = {
          coin: 'USDT',
          transactionType: WalletTransactionType.Order,
          type: WalletType.Withdraw,
          reason: 'تبدیل به ریال',
          userId: context.user._id,
          amount: createOrderDto.amount,
          side: createOrderDto.side,
          pairSymbol: 'IRT',
          priceFiat: lastPrice,
        };
      }
      const trackId = generateTrackingCode();
      const payload = {
        symbol: symbol._id,
        pairSymbol: pairSymbol._id,
        amount: createOrderDto.amount,
        user: context.user._id,
        side: createOrderDto.side,
        price: lastPrice,
        trackId,
      };
      await new this.orderModel(payload).save();

      await this.walletService.create(payloadIncrease, context);
      await this.walletService.create(payloadDecrease, context);

      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(listOrderDto: ListOrderDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = -1,
      side = 'all',
      userId,
    } = listOrderDto;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = {
        $or: [{ price: regex }, { amount: regex }, { trackId: regex }],
      };
    }
    let match: any = {
      side,
      user: new Types.ObjectId(userId),
      ...query,
    };
    if (!userId) delete match['user'];
    if (side === 'all') delete match['side'];
    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === -1 ? -1 : 1,
    };
    console.log(match);
    const [data, total] = await Promise.all([
      this.orderModel
        .find(match)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate(['symbol', 'pairSymbol', 'user'])
        .exec(),
      this.orderModel.countDocuments(match).exec(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async count(userId: string) {
    return this.orderModel.countDocuments({ user: userId }).exec();
  }
}
