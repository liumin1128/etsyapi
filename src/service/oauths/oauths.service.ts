import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateOAuthDto,
  FindOneOAuthDto,
  UpdateUserOAuthDto,
} from './dto/create.dto';
import { OAuth, OAuthDocument } from './oauths.schema';

@Injectable()
export class OAuthsService {
  constructor(
    @InjectModel(OAuth.name) private readonly oauthModel: Model<OAuthDocument>,
  ) {}

  async create(createOAuthDto: CreateOAuthDto): Promise<OAuthDocument> {
    const createdOAuth = new this.oauthModel(createOAuthDto);
    return createdOAuth.save();
  }

  async findOne(findOneOAuthDto: FindOneOAuthDto): Promise<OAuthDocument> {
    return this.oauthModel.findOne(findOneOAuthDto);
  }

  async update(updateUserOAuthDto: UpdateUserOAuthDto): Promise<OAuthDocument> {
    return this.oauthModel.findByIdAndUpdate(updateUserOAuthDto);
  }

  async findAll(): Promise<OAuthDocument[]> {
    return this.oauthModel.find().exec();
  }

  async updateOne(...args: any[]): Promise<any> {
    return this.oauthModel.updateOne(...args);
  }
}
