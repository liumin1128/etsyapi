import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto, ReplyCommentDto } from './comments.dto';
import { Comment, CommentDocument } from './comments.schema';
import { getCommentsPipline } from '@/utils/mongo/pipline/comments';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentDocument> {
    const createdComment = new this.commentsModel(createCommentDto);
    await createdComment.save();
    await createdComment.populate('user');
    await createdComment.populate({
      path: 'replyTo',
      populate: { path: 'user' },
    });
    return createdComment;
  }

  async findAll(object: string, user: string): Promise<CommentDocument[]> {
    const pipeline = getCommentsPipline(object, user);
    const data = await this.commentsModel.aggregate(pipeline);
    return data;
  }

  async findById(_id: string): Promise<CommentDocument> {
    return this.commentsModel.findById(_id);
  }
}
