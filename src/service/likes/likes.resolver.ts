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
import { CommentsService } from '@/service/comments/comments.service';
import { DynamicsService } from '@/service/dynamics/dynamics.service';
import { RetroMessagesService } from '@/service/retros/messages/service';
import { LikeDocument as Like } from './likes.schema';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './likes.dto';
import { UseGuards } from '@nestjs/common';

const pubSub = new PubSub();

@Resolver('Likes')
export class LikesResolver {
  constructor(
    private readonly retroMessagesService: RetroMessagesService,
    private readonly likesService: LikesService,
    private readonly commentsService: CommentsService,
    private readonly newsService: NewsService,
    private readonly dynamicsService: DynamicsService,
  ) {}

  @Query('findLikes')
  async findLikes(): Promise<Like[]> {
    const data = await this.likesService.findAll();
    return data;
  }

  @Query('findLike')
  async findLike(@Args('_id') _id: string): Promise<Like> {
    const data = await this.likesService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createLike')
  async createLike(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateLikeDto,
  ): Promise<Like | null> {
    const liked = await this.likesService.findOne(user._id, input.object);

    if (liked) {
      // liked.remove();
      liked.deleteOne();
      return null;
    }

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
      const createdLike = await this.likesService.create({
        user,
        ...input,
      });

      createdLike.object = object;

      pubSub.publish('likeCreated', { likeCreated: createdLike });
      return createdLike;
    }
  }

  @Subscription('likeCreated')
  likeCreated() {
    return pubSub.asyncIterator('likeCreated');
  }
}

@Resolver('LikeObjectUnion')
export class LikeObjectUnionResolver {
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
      return 'Like';
    }
    return null;
  }
}
