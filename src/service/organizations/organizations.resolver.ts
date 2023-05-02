// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { OrganizationDocument as Organization } from './organizations.schema';
import { OrganizationsService } from './organizations.service';

@Resolver('Organizations')
export class OrganizationsResolver {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Query('findOrganizations')
  async findOrganizations(): Promise<Organization[]> {
    return await this.organizationsService.findAll();
  }

  @Query('findOrganization')
  async findOrganization(@Args('_id') _id: string): Promise<Organization> {
    return await this.organizationsService.findById(_id);
  }
}
