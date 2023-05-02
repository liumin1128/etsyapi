import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import { UserDocument } from '@/service/users/schemas/users.schema';
import { OrganizationDocument } from '@/service/organizations/organizations.schema';

@Schema({ timestamps: true })
export class UserToOrganization {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  organization: OrganizationDocument;

  @Prop({ default: false })
  isCurrent: boolean;
}

const UserToOrganizationSchema =
  SchemaFactory.createForClass(UserToOrganization);

UserToOrganizationSchema.plugin(mongoosePaginate);
UserToOrganizationSchema.plugin(mongooseDelete);

type UserToOrganizationDocument = UserToOrganization & mongoose.Document;

export { UserToOrganizationSchema, UserToOrganizationDocument };
