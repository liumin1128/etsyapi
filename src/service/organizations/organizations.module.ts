import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsService } from './organizations.service';
import { OrganizationsResolver } from './organizations.resolver';
import { Organization, OrganizationSchema } from './organizations.schema';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  providers: [OrganizationsService, OrganizationsResolver],
  exports: [OrganizationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
