import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHashtagDto } from './hashtags.dto';
import { Hashtag, HashtagDocument } from './hashtags.schema';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectModel(Hashtag.name)
    private readonly hashtagsModel: Model<HashtagDocument>,
  ) {}
  async create(createHashtagDto: CreateHashtagDto): Promise<HashtagDocument> {
    const createdHashtag = new this.hashtagsModel(createHashtagDto);
    await createdHashtag.save();
    return createdHashtag;
  }

  async findAll(): Promise<HashtagDocument[]> {
    return this.hashtagsModel.find();
  }

  async findOne(user: string, object: string): Promise<HashtagDocument> {
    return this.hashtagsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<HashtagDocument> {
    return this.hashtagsModel.findById(_id);
  }
}
