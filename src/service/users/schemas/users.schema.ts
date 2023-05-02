import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  nickname: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  sex: number;

  @Prop()
  sign: string;

  @Prop()
  birthday: Date;

  @Prop()
  position: string;

  @Prop()
  company: string;

  @Prop()
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseDelete);

type UserDocument = User & mongoose.Document;

export { UserSchema, UserDocument };
