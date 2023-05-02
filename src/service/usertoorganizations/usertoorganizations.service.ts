import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserToOrganizationDto } from './usertoorganizations.dto';
import {
  UserToOrganization,
  UserToOrganizationDocument,
} from './usertoorganizations.schema';

@Injectable()
export class UserToOrganizationsService {
  constructor(
    @InjectModel(UserToOrganization.name)
    private readonly model: Model<UserToOrganizationDocument>,
  ) {}
  async create(
    createOrganizationDto: CreateUserToOrganizationDto,
  ): Promise<UserToOrganizationDocument> {
    const createdUserToOrganization = new this.model(createOrganizationDto);
    await createdUserToOrganization.save();
    return createdUserToOrganization;
  }

  async findAll(
    params?: Record<any, unknown>,
  ): Promise<UserToOrganizationDocument[]> {
    return this.model.find(params).populate('organization').populate('user');
  }

  async findOne(
    params: Record<string, unknown>,
  ): Promise<UserToOrganizationDocument> {
    return this.model.findOne(params).populate('organization').populate('user');
  }

  async findById(_id: string): Promise<UserToOrganizationDocument> {
    return this.model.findById(_id);
  }
}
