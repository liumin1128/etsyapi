import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInterestDto } from './interests.dto';
import { Interest, InterestDocument } from './interests.schema';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel(Interest.name)
    private readonly interestsModel: Model<InterestDocument>,
  ) {}
  async create(
    createInterestDto: CreateInterestDto,
  ): Promise<InterestDocument> {
    const createdInterest = new this.interestsModel(createInterestDto);
    await createdInterest.save();
    return createdInterest;
  }

  async findAll(): Promise<InterestDocument[]> {
    return this.interestsModel.find();
  }

  async findOne(user: string, object: string): Promise<InterestDocument> {
    return this.interestsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<InterestDocument> {
    return this.interestsModel.findById(_id);
  }
}
