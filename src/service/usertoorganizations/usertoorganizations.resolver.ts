// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';
import { UserToOrganizationDocument } from './usertoorganizations.schema';
import { UserToOrganizationsService } from './usertoorganizations.service';
import { OrganizationsService } from '@/service/organizations/organizations.service';
import { UsersService } from '@/service/users/users.service';
import { CreateUserToOrganizationDto } from './usertoorganizations.dto';
import { CreateOrganizationDto } from '@/service/organizations/organizations.dto';
import { OrganizationDocument } from '@/service/organizations/organizations.schema';
import { UserDocument } from '@/service/users/schemas/users.schema';

@Resolver('UserToOrganizations')
export class UserToOrganizationsResolver {
  constructor(
    private readonly userToOrganizationsService: UserToOrganizationsService,
    private readonly organizationsService: OrganizationsService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query('myOrganizations')
  async myOrganizations(
    @CurrentUser() user: SignUserPayload,
  ): Promise<OrganizationDocument[]> {
    const record = await this.userToOrganizationsService.findAll({
      user: user._id,
    });
    return record.map((i) => i.organization);
  }

  @UseGuards(GqlAuthGuard)
  @Query('currentOrganization')
  async currentOrganization(
    @CurrentUser() user: SignUserPayload,
  ): Promise<OrganizationDocument> {
    const record = await this.userToOrganizationsService.findOne({
      user: user._id,
      isCurrent: true,
    });
    return record.organization;
  }

  @UseGuards(GqlAuthGuard)
  @Query('currentOrganizationUsers')
  async currentOrganizationUsers(
    @CurrentUser() user: SignUserPayload,
  ): Promise<UserDocument[]> {
    const currentRecord = await this.userToOrganizationsService.findOne({
      user: user._id,
      isCurrent: true,
    });

    const record = await this.userToOrganizationsService.findAll({
      organization: currentRecord.organization._id,
    });

    return record.map((i) => i.user);
  }

  @Query('userToOrganizations')
  async userToOrganizations(
    @Args('user') user: string,
    @Args('organization') organization: string,
  ): Promise<UserToOrganizationDocument[]> {
    const params: Record<any, unknown> = {};
    if (organization) {
      params.organization = organization;
    }
    if (user) {
      params.user = user;
    }
    return await this.userToOrganizationsService.findAll(params);
  }

  @Query('userToOrganization')
  async userToOrganization(
    @Args('_id') _id: string,
  ): Promise<UserToOrganizationDocument> {
    return await this.userToOrganizationsService.findById(_id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('organizationInviteUser')
  async organizationInviteUser(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateUserToOrganizationDto,
  ): Promise<UserToOrganizationDocument> {
    // 检查organization
    const organization = await this.organizationsService.findById(
      input.organization,
    );
    if (!organization) {
      throw new Error('Organization not found');
    }

    // 检查user
    const objuser = await this.userService.findById(input.user);
    if (!objuser) {
      throw new Error('User not found');
    }

    // 检查权限
    if (organization.owner._id + '' !== user._id) {
      throw new Error('Permission denied');
    }

    // 是否已经加入
    const joinedCrganization = await this.userToOrganizationsService.findOne({
      user: input.user,
      organization: input.organization,
    });
    if (joinedCrganization) {
      throw new Error('User Joined');
    }

    // 是否存在currentOrganization
    const hasCurrentOrganization =
      await this.userToOrganizationsService.findOne({
        user: input.user,
        isCurrent: true,
      });

    return await this.userToOrganizationsService.create({
      ...input,
      isCurrent: !hasCurrentOrganization,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('organizationRemoveUser')
  async organizationRemoveUser(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateUserToOrganizationDto,
  ): Promise<UserToOrganizationDocument> {
    // 检查organization
    const organization = await this.organizationsService.findById(
      input.organization,
    );
    if (!organization) {
      throw new Error('Organization not found');
    }

    // 检查user
    const objuser = await this.userService.findById(input.user);
    if (!objuser) {
      throw new Error('User not found');
    }

    // 检查权限
    if (organization.owner._id + '' !== user._id) {
      throw new Error('Permission denied');
    }

    // 是否已经加入
    const joinedCrganization = await this.userToOrganizationsService.findOne({
      user: input.user,
      organization: input.organization,
    });

    if (joinedCrganization) {
      // joinedCrganization.remove();
      joinedCrganization.deleteOne();

      return joinedCrganization;
    }

    throw new Error('User Not Exist');
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createOrganization')
  async createOrganization(
    @CurrentUser() user: SignUserPayload,
    @Args('input') input: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    const organization = await this.organizationsService.create({
      ...input,
      owner: user._id,
    });

    // 是否存在currentOrganization
    const hasCurrentOrganization =
      await this.userToOrganizationsService.findOne({
        user: user._id,
        isCurrent: true,
      });

    // 加入新创建的Organization
    await this.userToOrganizationsService.create({
      user: user._id,
      organization: organization._id + '',
      isCurrent: !hasCurrentOrganization,
    });

    return organization;
  }
}
