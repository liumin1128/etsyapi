import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './organizations.dto';
import { Organization, OrganizationDocument } from './organizations.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationsModel: Model<OrganizationDocument>,
  ) {}
  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    const createdOrganization = new this.organizationsModel(
      createOrganizationDto,
    );
    await createdOrganization.save();
    return createdOrganization;
  }

  async findAll(): Promise<OrganizationDocument[]> {
    return this.organizationsModel.find().populate('owner');
  }

  async findOne(
    params: Record<string, unknown>,
  ): Promise<OrganizationDocument> {
    return this.organizationsModel.findOne(params).populate('owner');
  }

  async findById(_id: string): Promise<OrganizationDocument> {
    return this.organizationsModel.findById(_id);
  }
}
