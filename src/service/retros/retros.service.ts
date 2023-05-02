import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRetroDto } from './retros.dto';
import { Retro, RetroDocument } from './retros.schema';
import { RetroMessage, RetroMessageDocument } from './messages/schema';

@Injectable()
export class RetrosService {
  constructor(
    @InjectModel(Retro.name)
    private readonly retrosModel: Model<RetroDocument>,

    @InjectModel(RetroMessage.name)
    private readonly retroMessagesModel: Model<RetroMessageDocument>,
  ) {}

  async create(createRetroDto: CreateRetroDto): Promise<RetroDocument> {
    const createdRetro = new this.retrosModel(createRetroDto);
    await createdRetro.save();
    await createdRetro.populate('user');
    return createdRetro;
  }

  async findAll({
    page = 0,
    pageSize = 10,
    user,
  }: {
    page?: number;
    pageSize?: number;
    user?: string;
  }): Promise<any> {
    console.log('user');
    console.log(user);
    const skip = page === 0 ? 0 : (page - 1) * pageSize;

    // https://www.5axxw.com/questions/content/3l0r6i
    return this.retrosModel.aggregate([
      // 关联查询retromessage信息
      // { $match: { $expr: { $eq: ['$user', new Types.ObjectId(user)] } } },

      {
        $sort: {
          createdAt: -1,
        },
      },

      { $skip: skip },

      { $limit: pageSize },

      {
        $lookup: {
          from: 'retromessages',
          let: { retro: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$retro', '$retro'] } } },

            {
              $group: {
                _id: '$type',
                count: { $sum: 1 },
              },
            },

            {
              $project: {
                _id: 0,
                k: '$_id',
                v: '$count',
              },
            },
          ],
          as: 'count',
        },
      },

      {
        $addFields: {
          count: { $arrayToObject: '$count' },
        },
      },

      {
        $lookup: {
          from: 'retromessages',
          let: { retro: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$$retro', '$retro'] } } },

            {
              $project: {
                like: 1,
              },
            },

            {
              $group: {
                _id: null,
                count: { $sum: '$like' },
              },
            },

            {
              $project: {
                _id: 0,
              },
            },
          ],
          as: 'likeCount',
        },
      },

      // 重新组织数据结构
      {
        $addFields: {
          likeCount: { $first: '$likeCount' },
        },
      },

      {
        $addFields: {
          likeCount: '$likeCount.count',
          happyCount: '$count.HAPPY',
          unhappyCount: '$count.UNHAPPY',
          wonderringCount: '$count.WONDERRING',
          todoCount: '$count.TODO',
        },
      },

      {
        $project: {
          count: 0,
        },
      },

      // 关联查询用户信息
      {
        $lookup: {
          from: 'users',
          let: { user: '$user' },
          pipeline: [{ $match: { $expr: { $eq: ['$$user', '$_id'] } } }],
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          user: '$user',
        },
      },
    ]);
  }

  async findById(_id: string): Promise<RetroDocument> {
    return this.retrosModel.findById(_id).populate('user');
  }
}
