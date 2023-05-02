import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRetroMessageDto, UpdateRetroMessageDto } from './dto';
import { RetroMessage, RetroMessageDocument } from './schema';

@Injectable()
export class RetroMessagesService {
  constructor(
    @InjectModel(RetroMessage.name)
    private readonly retroMessagesModel: Model<RetroMessageDocument>,
  ) {}

  async create(
    createRetroMessageDto: CreateRetroMessageDto,
  ): Promise<RetroMessageDocument> {
    const createdRetroMessage = new this.retroMessagesModel(
      createRetroMessageDto,
    );
    await createdRetroMessage.save();
    await createdRetroMessage.populate('user');
    return createdRetroMessage;
  }

  async update(
    _id: string,
    updateRetroMessageDto: UpdateRetroMessageDto,
  ): Promise<RetroMessageDocument> {
    const obj = await this.retroMessagesModel
      .findByIdAndUpdate(_id, updateRetroMessageDto, { new: true })
      .populate('user');
    return obj;
  }

  async like(_id: string, count: number): Promise<RetroMessageDocument> {
    const obj = await this.retroMessagesModel
      .findByIdAndUpdate(
        _id,
        {
          $inc: { like: count },
        },
        { new: true },
      )
      .populate('user');
    return obj;
  }

  async findAll(query): Promise<RetroMessageDocument[]> {
    return this.retroMessagesModel
      .find(query)
      .sort({ updatedAt: -1 })
      .populate('user');
  }

  async findById(_id: string): Promise<RetroMessageDocument> {
    return this.retroMessagesModel.findById(_id);
  }

  async delete(_id: string): Promise<RetroMessageDocument> {
    const obj = await this.retroMessagesModel.findById(_id).populate('user');
    if (!obj) return;
    await this.retroMessagesModel.deleteOne({ _id });
    return obj;
  }
}
