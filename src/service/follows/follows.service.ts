import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFollowDto } from './follows.dto';
import { Follow, FollowDocument } from './follows.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private readonly followsModel: Model<FollowDocument>,
  ) {}
  async create(createFollowDto: CreateFollowDto): Promise<FollowDocument> {
    const createdFollow = new this.followsModel(createFollowDto);
    await createdFollow.save();
    return createdFollow;
  }

  async findAll(): Promise<FollowDocument[]> {
    return this.followsModel.find();
  }

  async findOne(user: string, object: string): Promise<FollowDocument> {
    return this.followsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<FollowDocument> {
    return this.followsModel.findById(_id);
  }
}
