// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription,
  ResolveField,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { NewsService } from '@/service/news/news.service';
import { DynamicsService } from '@/service/dynamics/dynamics.service';
import { RetroMessagesService } from '@/service/retros/messages/service';
import { CommentDocument as Comment } from './comments.schema';
import { CommentsService } from './comments.service';
import { CreateCommentDto, ReplyCommentDto } from './comments.dto';
import { UseGuards } from '@nestjs/common';
import { GetToken } from '@/graphql/graphql.decorators';
import { AuthService } from '@/service/auth/auth.service';

const pubSub = new PubSub();

@Resolver('Comments')
export class CommentsResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly retroMessagesService: RetroMessagesService,
    private readonly commentsService: CommentsService,
    private readonly newsService: NewsService,
    private readonly dynamicsService: DynamicsService,
  ) {}

  @Query('findComments')
  async findComments(
    @GetToken() token: string,
    @Args('object') object: string,
  ): Promise<Comment[]> {
    let user;
    try {
      const { _id } = await this.authService.verify(token);
      user = _id;
    } catch (error) {
      console.log('error');
      console.log(error);
    }

    const data = await this.commentsService.findAll(object, user);
    return data;
  }

  @Query('findComment')
  async findComment(@Args('_id') _id: string): Promise<Comment> {
    const data = await this.commentsService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createComment')
  async createComment(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateCommentDto,
  ): Promise<Comment> {
    let object;

    switch (input.objectModel) {
      case 'Comment': {
        object = await this.commentsService.findById(input.object);
        break;
      }
      case 'Dynamic': {
        object = await this.dynamicsService.findById(input.object);
        break;
      }
      case 'News': {
        object = await this.newsService.findById(input.object);
        break;
      }
      case 'RetroMessage': {
        object = await this.retroMessagesService.findById(input.object);
        break;
      }
      default:
        return;
    }

    if (object) {
      const createdComment = await this.commentsService.create({
        user,
        ...input,
      });

      createdComment.object = object;

      pubSub.publish('commentCreated', { commentCreated: createdComment });
      return createdComment;
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('replyComment')
  async replyComment(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: ReplyCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentsService.findById(input.to);

    if (comment) {
      const createdComment = await this.commentsService.create({
        user: user._id,
        content: input.content,
        object: comment.object + '',
        // eslint-disable-next-line
        //@ts-ignore
        objectModel: comment.objectModel,
        commentTo: comment.commentTo || comment._id,
        replyTo: comment._id,
      });

      pubSub.publish('commentCreated', { commentCreated: createdComment });
      return createdComment;
    }
  }

  @Subscription('commentCreated')
  commentCreated() {
    return pubSub.asyncIterator('commentCreated');
  }
}

@Resolver('CommentObjectUnion')
export class CommentObjectUnionResolver {
  @ResolveField()
  __resolveType(value, context, info) {
    console.log('value, context, info');
    console.log(value, context, info);
    if (value.title) {
      return 'News';
    }
    if (value.status) {
      return 'RetroMessage';
    }
    if (value.content) {
      return 'Comment';
    }
    return null;
  }
}
