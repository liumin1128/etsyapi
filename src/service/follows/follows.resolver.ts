import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { FollowDocument as Follow } from './follows.schema';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './follows.dto';

@Resolver('Follows')
export class FollowsResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query('findFollows')
  async findFollows(): Promise<Follow[]> {
    const data = await this.followsService.findAll();
    return data;
  }

  @Query('findFollow')
  async findFollow(@Args('_id') _id: string): Promise<Follow> {
    const data = await this.followsService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createFollow')
  async createFollow(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateFollowDto,
  ): Promise<Follow | null> {
    const createdFollow = await this.followsService.create({
      from: user,
      ...input,
    });
    return createdFollow;
  }
}
