import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToOrganizationsService } from './usertoorganizations.service';
import { UserToOrganizationsResolver } from './usertoorganizations.resolver';
import {
  UserToOrganization,
  UserToOrganizationSchema,
} from './usertoorganizations.schema';
import { UserModule } from '@/service/users/users.module';
import { OrganizationsModule } from '@/service/organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToOrganization.name, schema: UserToOrganizationSchema },
    ]),
    UserModule,
    OrganizationsModule,
  ],
  providers: [UserToOrganizationsService, UserToOrganizationsResolver],
  exports: [UserToOrganizationsService],
  controllers: [],
})
export class UserToOrganizationModule {}
