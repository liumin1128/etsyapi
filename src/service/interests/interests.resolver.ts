// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { InterestDocument as Interest } from './interests.schema';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './interests.dto';

@Resolver('Interests')
export class InterestsResolver {
  constructor(private readonly interestsService: InterestsService) {}

  @Query('findInterests')
  async findInterests(): Promise<Interest[]> {
    const data = await this.interestsService.findAll();
    return data;
  }

  @Query('findInterest')
  async findInterest(@Args('_id') _id: string): Promise<Interest> {
    const data = await this.interestsService.findById(_id);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createInterest')
  async createInterest(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateInterestDto,
  ): Promise<Interest | null> {
    const createdInterest = await this.interestsService.create({
      user,
      ...input,
    });

    return createdInterest;
  }
}
