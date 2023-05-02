import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopicDto } from './topics.dto';
import { Topic, TopicDocument } from './topics.schema';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name)
    private readonly topicsModel: Model<TopicDocument>,
  ) {}
  async create(createTopicDto: CreateTopicDto): Promise<TopicDocument> {
    const createdTopic = new this.topicsModel(createTopicDto);
    await createdTopic.save();
    return createdTopic;
  }

  async findAll(): Promise<TopicDocument[]> {
    return this.topicsModel.find();
  }

  async findOne(user: string, object: string): Promise<TopicDocument> {
    return this.topicsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<TopicDocument> {
    return this.topicsModel.findById(_id);
  }
}
