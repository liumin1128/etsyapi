import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLikeDto } from './likes.dto';
import { Like, LikeDocument } from './likes.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private readonly likesModel: Model<LikeDocument>,
  ) {}
  async create(createLikeDto: CreateLikeDto): Promise<LikeDocument> {
    const createdLike = new this.likesModel(createLikeDto);
    await createdLike.save();
    return createdLike;
  }

  async findAll(): Promise<LikeDocument[]> {
    return this.likesModel.find();
  }

  async findOne(user: string, object: string): Promise<LikeDocument> {
    return this.likesModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<LikeDocument> {
    return this.likesModel.findById(_id);
  }
}
