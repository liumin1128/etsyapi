// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard, CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { ApolloError } from 'apollo-server';
import { removeEmptyValue } from '@/utils/common';
import { UserToSeatDocument as UserToSeat } from './usertoseats.schema';
import { UserToSeatsService } from './usertoseats.service';
import { CreateUserToSeatDto, DeleteUserToSeatDto } from './usertoseats.dto';
import { SeatsService } from '../seats/seats.service';

const pubSub = new PubSub();

@Resolver('UserToSeats')
export class UserToSeatsResolver {
  constructor(
    private readonly userToSeatsService: UserToSeatsService,
    private readonly seatService: SeatsService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query('findUserToSeats')
  async findUserToSeats(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number,
    @Args('seat') seat: string,
    @Args('user') user: string,
  ): Promise<UserToSeat[]> {
    const start = startDate;
    const end = endDate || startDate;

    const query = removeEmptyValue({
      $and: [
        { date: { $gte: start } },
        { date: { $lte: dayjs(end).endOf('day') }.valueOf() },
      ],
      seat,
      user,
    });

    const data = await this.userToSeatsService.findAll(query);
    return data;
  }

  @UseGuards(GqlAuthGuard)
  @Query('findUserToSeat')
  async findUserToSeat(@Args('_id') _id: string): Promise<UserToSeat> {
    return await this.userToSeatsService.findById(_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createUserToSeat')
  async createUserToSeat(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateUserToSeatDto,
  ): Promise<UserToSeat | null> {
    const { seat, date } = input;

    // 检查座位是否可用，
    const seatObj = await this.seatService.findById(seat);

    if (!seatObj) {
      throw new ApolloError('seat not found');
    }

    // 检查本人今日是否已选座，如果有需要先清除选座
    const userToSeat = await this.userToSeatsService.findOne({
      $or: [
        { date, user },
        { date, seat },
      ],
    });

    if (userToSeat) {
      // 如果选座记录存在，反馈不可以重复选座
      throw new ApolloError('Seats have been selected for this day');
    }

    const createdUserToSeat = await this.userToSeatsService.create({
      user: user._id,
      seat,
      date,
    });

    pubSub.publish('userToSeatCreated', {
      userToSeatCreated: createdUserToSeat,
    });

    return createdUserToSeat;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('deleteUserToSeat')
  async deleteUserToSeat(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: DeleteUserToSeatDto,
  ): Promise<UserToSeat | null> {
    const { seat, date } = input;

    // 检查座位是否可用，
    const seatObj = await this.seatService.findById(seat);
    if (!seatObj) {
      throw new ApolloError('seat not found');
    }

    // 检查本人今日是否已选座，如果有需要先清除选座
    const query = removeEmptyValue({ date, seat, user });
    const userToSeat = await this.userToSeatsService.findOne(query);

    if (!userToSeat) {
      // 如果选座记录不存在，反馈无法取消选座
      throw new ApolloError('The seat selection record does not exist');
    }

    const userToSeatDeleted = await this.userToSeatsService.delete(
      userToSeat._id,
    );

    pubSub.publish('userToSeatDeleted', {
      userToSeatDeleted: userToSeatDeleted,
    });

    return userToSeatDeleted;
  }

  @Subscription('userToSeatCreated')
  userToSeatCreated() {
    return pubSub.asyncIterator('userToSeatCreated');
  }

  @Subscription('userToSeatDeleted')
  userToSeatDeleted() {
    return pubSub.asyncIterator('userToSeatDeleted');
  }
}
