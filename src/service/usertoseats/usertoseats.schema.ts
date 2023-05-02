import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class UserToSeat {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' })
  seat: mongoose.Types.ObjectId;

  @Prop()
  date: Date;
}

const UserToSeatSchema = SchemaFactory.createForClass(UserToSeat);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
UserToSeatSchema.plugin(mongoosePaginate);
UserToSeatSchema.plugin(mongooseDelete);
// UserToSeatSchema.plugin(mongooseAutopopulate);

type UserToSeatDocument = UserToSeat & mongoose.Document;

export { UserToSeatSchema, UserToSeatDocument };
