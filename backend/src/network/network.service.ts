import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateNetworkDto } from './dto/create-network.dto';
import { UpdateNetworkDto } from './dto/update-network.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Network, NetworkDocument } from './entities/network.entity';
import mongoose, { Model } from 'mongoose';
import * as msg from '../utils/messages.json';
import { ListNetworkDto } from './dto/list-network.dto';

@Injectable()
export class NetworkService {
  constructor(
    @InjectModel(Network.name)
    private networkModel: Model<NetworkDocument>,
  ) {}
  async create(createNetworkDto: CreateNetworkDto) {
    try {
      let network = await this.networkModel.create(createNetworkDto);
      return network;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, updateNetworkDto: UpdateNetworkDto) {
    try {
      let network = await this.networkModel.findByIdAndUpdate(
        id,
        updateNetworkDto,
        { new: true },
      );
      return network;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    return await this.networkModel.find({ status: true });
  }

  async findForAdmin(listNetworkDto: ListNetworkDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = -1,
    } = listNetworkDto;
    const skip = (page - 1) * limit;
    const match: any = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      match.$or = [{ name: regex }, { persianName: regex }, { slug: regex }];
    }
    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === -1 ? -1 : 1,
    };
    const [data, total] = await Promise.all([
      this.networkModel
        .find(match)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.networkModel.countDocuments(match).exec(),
    ]);
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findWithSymbol(symbolId: string) {
    return await this.networkModel.find({
      symbol: mongoose.Types.ObjectId.createFromHexString(symbolId),
      status: true,
    });
  }

  async findById(networkId: string) {
    return await this.networkModel.findById(networkId);
  }
}
