import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import * as msg from '../utils/messages.json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SymbolDocument } from './entities/symbol.entity';
import { ListSymbolDto } from './dto/list-symbol.dto';
import { NetworkService } from 'src/network/network.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SettingService } from 'src/setting/setting.service';

@Injectable()
export class SymbolService {
  private readonly TETHER_LAND_API_URL: string;
  private readonly OKEX_API_URL: string;

  constructor(
    @InjectModel(Symbol.name)
    private symbolModel: Model<SymbolDocument>,
    private networkService: NetworkService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly settingService: SettingService,
  ) {
    this.TETHER_LAND_API_URL =
      this.config.get<string>('TETHER_LAND_API_URL') || '';
    this.OKEX_API_URL = this.config.get<string>('OKEX_API_URL') || '';
  }

  async create(createSymbolDto: CreateSymbolDto) {
    try {
      let symbol = await this.symbolModel.create(createSymbolDto);
      return symbol;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateSymbolDto: UpdateSymbolDto) {
    try {
      let symbol = await this.symbolModel.findByIdAndUpdate(
        id,
        updateSymbolDto,
        { new: true },
      );
      return symbol;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getFromExternalSources() {
    try {
      const symbol = await this.symbolModel.findOne({ symbol: 'USDT' });
      if (!symbol) {
        throw new Error('symbolNotFound');
      }
      switch (symbol.externalExchange) {
        case 'tetherland':
          await this.getFromTetherLand();
          break;
        case 'okex':
          await this.getFromOKEX();
          break;
        case 'afratether':
          await this.getAfratether();
          break;
        case 'chand':
          await this.getFromChand();
          break;
        default:
          console.log(`Unknown external exchange: ${symbol.externalExchange}`);
          break;
      }
    } catch (error) {}
  }

  async getFromTetherLand() {
    try {
      const { data } = await firstValueFrom(
        this.http.get(this.TETHER_LAND_API_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      if (data.status === 200) {
        let usdt = data?.data?.currencies?.USDT;
        const symbol = await this.symbolModel.findOne({ symbol: 'USDT' });
        if (symbol) {
          await this.settingService.setCache(
            'symbolUsdt',
            JSON.stringify(symbol),
          );
          symbol.last = usdt.price;
          symbol.diff24d = usdt.diff24d;
          symbol.diff7d = usdt.diff7d;
          symbol.diff30d = usdt.diff30d;
          symbol.last7d = usdt.last7d;
          symbol.last24h = usdt.last24h;
          symbol.last30d = usdt.last30d;
          symbol.high = usdt.last24hMax;
          symbol.low = usdt.last24hMin;
          await symbol.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getFromChand() {
    try {
      const { data } = await firstValueFrom(
        this.http.get(
          'https://chandshode.com/api/Gold_Currency.php?fields=currency',
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      if (data.status === 200) {
        const currencies = data?.data?.currency;
        const usdt = currencies.find((item: any) => item.symbol === 'USDT_IRT');
        const symbol = await this.symbolModel.findOne({ symbol: 'USDT' });
        if (symbol) {
          await this.settingService.setCache(
            'symbolUsdt',
            JSON.stringify(symbol),
          );
          symbol.last = usdt.price;
          await symbol.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAfratether() {
    const { data } = await firstValueFrom(
      this.http.post(
        'https://afrap2p.com/api/v1.0/user/login',
        {
          Password: 'Masoud66158601@',
          Mobile: '9335545256',
          MobileCode: '0098',
        },
        {
          headers: {
            Origin: 'https://app.afratether.com',
          },
        },
      ),
    );
    if (data.Success === true) {
      const response = await firstValueFrom(
        this.http.get('https://afrap2p.com/api/v1.0/exchange-rate', {
          headers: {
            authorization: data.Items.accessToken,
          },
        }),
      );

      if (response.data.Success === true) {
        let usdt = response.data?.Items[0]?.sell;
        const symbol = await this.symbolModel.findOne({ symbol: 'USDT' });
        if (symbol) {
          await this.settingService.setCache(
            'symbolUsdt',
            JSON.stringify(symbol),
          );
          symbol.last = usdt / 10;
          await symbol.save();
        }
      }
    }
  }

  async getFromOKEX() {
    try {
      const { data } = await firstValueFrom(
        this.http.get(this.OKEX_API_URL, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
      if (data.code === 100) {
        let usdt = data?.ticker;
        const symbol = await this.symbolModel.findOne({ symbol: 'USDT' });
        if (symbol) {
          symbol.last = parseFloat(usdt.last);
          symbol.high = usdt.high_24h;
          symbol.low = usdt.low_24h;
          await symbol.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    let symbols = await this.symbolModel.find({ status: true });
    let result: any[] = [];
    for (let index = 0; index < symbols.length; index++) {
      const element = symbols[index];
      const networks = await this.networkService.findWithSymbol(
        element._id.toString(),
      );
      const symbolObj = element.toObject() as any;
      symbolObj.networks = networks;
      result.push(symbolObj);
    }
    return result;
  }

  async findForAdmin(listSymbolDto: ListSymbolDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = -1,
    } = listSymbolDto;
    const skip = (page - 1) * limit;
    const match: any = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      match.$or = [
        { name: regex },
        { persianName: regex },
        { slug: regex },
        { symbol: regex },
      ];
    }
    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === -1 ? -1 : 1,
    };
    const [data, total] = await Promise.all([
      this.symbolModel.find(match).sort(sortObj).skip(skip).limit(limit).exec(),
      this.symbolModel.countDocuments(match).exec(),
    ]);
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findBySymbol(search: string) {
    return await this.symbolModel.findOne({
      symbol: { $regex: search, $options: 'i' },
      status: true,
    });
  }
}
