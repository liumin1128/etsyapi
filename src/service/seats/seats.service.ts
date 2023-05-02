import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSeatDto } from './seats.dto';
import { Seat, SeatDocument } from './seats.schema';

@Injectable()
export class SeatsService {
  constructor(
    @InjectModel(Seat.name)
    private readonly seatsModel: Model<SeatDocument>,
  ) {}
  async create(createSeatDto: CreateSeatDto): Promise<SeatDocument> {
    const createdSeat = new this.seatsModel(createSeatDto);
    await createdSeat.save();
    return createdSeat;
  }

  async findAll(): Promise<SeatDocument[]> {
    return this.seatsModel.find();
  }

  async findOne(user: string, object: string): Promise<SeatDocument> {
    return this.seatsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<SeatDocument> {
    return this.seatsModel.findById(_id);
  }
}
