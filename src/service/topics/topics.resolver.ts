// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { TopicDocument as Topic } from './topics.schema';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './topics.dto';

@Resolver('Topics')
export class TopicsResolver {
  constructor(private readonly topicsService: TopicsService) {}

  @Query('findTopics')
  async findTopics(): Promise<Topic[]> {
    const data = await this.topicsService.findAll();
    return data;
  }

  @Query('findTopic')
  async findTopic(@Args('_id') _id: string): Promise<Topic> {
    const data = await this.topicsService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createTopic')
  async createTopic(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateTopicDto,
  ): Promise<Topic | null> {
    const createdTopic = await this.topicsService.create({
      user,
      ...input,
    });

    return createdTopic;
  }
}
