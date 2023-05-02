import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { RetroDocument as Retro } from './retros.schema';
import { RetrosService } from './retros.service';
import { CreateRetroDto } from './retros.dto';
import { removeEmptyValue } from '@/utils/common';

const pubSub = new PubSub();

@Resolver('Retros')
export class RetrosResolver {
  constructor(
    private readonly retrosService: RetrosService, // private readonly userToOrganizationsService: UserToOrganizationsService,
  ) {}

  @Query('findRetro')
  async findRetro(@Args('_id') _id: string): Promise<Retro> {
    return this.retrosService.findById(_id);
  }

  @Query('findRetros')
  @UseGuards(GqlAuthGuard)
  async findRetros(
    @CurrentUser() user: SignUserPayload,
    @Args('page') page?: number,
    @Args('pageSize') pageSize?: number,
  ): Promise<Retro[]> {
    const query = removeEmptyValue({ page, pageSize, user: user._id });
    return this.retrosService.findAll(query);
  }

  @Mutation('createRetro')
  @UseGuards(GqlAuthGuard)
  async create(
    @CurrentUser() user: SignUserPayload,
    @Args('input') args: CreateRetroDto,
  ): Promise<Retro> {
    const createdRetro = await this.retrosService.create({
      user,
      ...args,
    });
    await pubSub.publish('retroCreated', { retroCreated: createdRetro });
    return createdRetro;
  }

  @Subscription('retroCreated')
  retroCreated() {
    return pubSub.asyncIterator('retroCreated');
  }
}
