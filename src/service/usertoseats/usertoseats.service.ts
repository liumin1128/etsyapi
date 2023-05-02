import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserToSeatDto } from './usertoseats.dto';
import { UserToSeat, UserToSeatDocument } from './usertoseats.schema';

@Injectable()
export class UserToSeatsService {
  constructor(
    @InjectModel(UserToSeat.name)
    private readonly userToSeatsModel: Model<UserToSeatDocument>,
  ) {}
  async create(
    createUserToSeatDto: CreateUserToSeatDto,
  ): Promise<UserToSeatDocument> {
    const createdUserToSeat = new this.userToSeatsModel(createUserToSeatDto);
    await createdUserToSeat.save();
    return createdUserToSeat;
  }

  async findAll(query: {
    date?: string;
    seat?: string;
    user?: string;
  }): Promise<UserToSeatDocument[]> {
    return this.userToSeatsModel.find(query).populate('user');
  }

  async findOne(query): Promise<UserToSeatDocument> {
    return this.userToSeatsModel.findOne(query);
  }

  async findById(_id: string): Promise<UserToSeatDocument> {
    return this.userToSeatsModel.findById(_id);
  }

  async delete(_id: string): Promise<UserToSeatDocument> {
    const obj = await this.userToSeatsModel.findById(_id).populate('user');
    if (!obj) return;
    await this.userToSeatsModel.deleteOne({ _id });
    return obj;
  }
}
