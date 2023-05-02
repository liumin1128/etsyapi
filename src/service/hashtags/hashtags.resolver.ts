// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { HashtagDocument as Hashtag } from './hashtags.schema';
import { HashtagsService } from './hashtags.service';
import { CreateHashtagDto } from './hashtags.dto';

@Resolver('Hashtags')
export class HashtagsResolver {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Query('findHashtags')
  async findHashtags(): Promise<Hashtag[]> {
    const data = await this.hashtagsService.findAll();
    return data;
  }

  @Query('findHashtag')
  async findHashtag(@Args('_id') _id: string): Promise<Hashtag> {
    const data = await this.hashtagsService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createHashtag')
  async createHashtag(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateHashtagDto,
  ): Promise<Hashtag | null> {
    const createdHashtag = await this.hashtagsService.create({
      user,
      ...input,
    });

    return createdHashtag;
  }
}
