import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Announcement,
  AnnouncementDocument,
} from './entities/announcement.entity';
import { Model } from 'mongoose';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ListAnnouncementDto } from './dto/list-announcement.dto';
import { DeleteAnnouncementDto } from './dto/delete-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    try {
      const createdAnnouncement = await new this.announcementModel(
        createAnnouncementDto,
      ).save();
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(updateAnnouncementDto: UpdateAnnouncementDto) {
    try {
      const { id, ...updateData } = updateAnnouncementDto;
      await this.announcementModel.updateOne({ _id: id }, { $set: updateData });
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findForAdmin(listAnnouncementDto: ListAnnouncementDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'createdAt',
      order = -1,
      importance = 'all',
    } = listAnnouncementDto;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = {
        $or: [{ title: regex }, { body: regex }],
      };
    }
    let match: any = {
      importance,
      ...query,
    };
    if (importance === 'all') delete match['importance'];
    const sortObj: Record<string, 1 | -1> = {
      [sort]: order === -1 ? -1 : 1,
    };
    console.log(match);
    const [data, total] = await Promise.all([
      this.announcementModel
        .find(match)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.announcementModel.countDocuments(match).exec(),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async delete(deleteAnnouncementDto: DeleteAnnouncementDto) {
    const { id } = deleteAnnouncementDto;
    try {
      await this.announcementModel.deleteOne({ _id: id });
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    return await this.announcementModel.find({ status: true });
  }
}
