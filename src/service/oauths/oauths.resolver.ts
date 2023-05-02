// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
// import { OAuths } from '@/graphql/graphql.schema';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { OAuthDocument as OAuth } from './oauths.schema';
import { OAuthsService } from './oauths.service';
import { CreateOAuthDto } from './dto/create.dto';

const pubSub = new PubSub();

@Resolver('OAuths')
export class OAuthsResolver {
  constructor(private readonly oauthsService: OAuthsService) {}

  @Query('oauths')
  @UseGuards(GqlAuthGuard)
  async getOAuths(@CurrentUser() user: SignUserPayload): Promise<OAuth[]> {
    console.log('user');
    console.log(user);
    return this.oauthsService.findAll();
  }

  // @Query('oauth')
  // async findById(_id: string): Promise<OAuth> {
  //   return this.oauthsService.findById(id);
  // }

  @Mutation('createOAuth')
  async create(
    @Args('createOAuthsInput') args: CreateOAuthDto,
  ): Promise<OAuth> {
    const createdOAuths = await this.oauthsService.create(args);
    pubSub.publish('oauthsCreated', { oauthsCreated: createdOAuths });
    return createdOAuths;
  }

  // @Subscription('oauthsCreated')
  // oauthsCreated() {
  //   return pubSub.asyncIterator('oauthsCreated');
  // }
}
