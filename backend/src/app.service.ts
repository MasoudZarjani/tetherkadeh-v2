import { Injectable } from '@nestjs/common';
import { WalletService } from './wallet/wallet.service';
import { SymbolService } from './symbol/symbol.service';
import { BankAccountService } from './bank-account/bank-account.service';
import { OrderService } from './order/order.service';
import { PriceHistoryService } from './price-history/price-history.service';
import { Timeframe } from './price-history/enums/timeframe.enum';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(
    private walletService: WalletService,
    private symbolService: SymbolService,
    private bankAccountService: BankAccountService,
    private orderService: OrderService,
    private priceHistoryService: PriceHistoryService,
    private userService: UserService,
  ) {}

  async dashboard(user: any) {
    try {
      const orders = await this.orderService.findAll({
        page: 1,
        limit: 5,
        userId: user._id,
      });
      const orderCount = await this.orderService.count(user._id);

      const depositCount = await this.walletService.depositCount(user._id);
      const withdrawalCount = await this.walletService.withdrawalCount(
        user._id,
      );
      const wallets = await this.walletService.inventory(user._id);
      const symbols = await this.symbolService.findAll();

      const priceData = await this.priceHistoryService.getStats({
        symbol: 'USDT',
        timeframe: Timeframe.H24,
      });
      const priceChart = await this.priceHistoryService.getChart({
        symbol: 'USDT',
        timeframe: Timeframe.H24,
        bucket: 'hour',
      });
      return {
        wallets: wallets.data,
        symbols,
        orderCount,
        depositCount,
        withdrawalCount,
        orders: orders.data,
        priceData: priceData,
        priceChart: priceChart,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async adminDashboard() {
    const userCount = await this.userService.count();

    return {
      userCount,
    };
  }

  async transaction(user: any) {
    try {
      const wallets = await this.walletService.inventory(user._id);
      const symbols = await this.symbolService.findAll();
      const bankAccounts = await this.bankAccountService.findAllByUser(user);
      return {
        wallets: wallets.data,
        symbols,
        bankAccounts,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
