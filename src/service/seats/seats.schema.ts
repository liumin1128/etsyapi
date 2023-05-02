import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class Seat {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;

  @Prop()
  icon: string;
}

const SeatSchema = SchemaFactory.createForClass(Seat);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
SeatSchema.plugin(mongoosePaginate);
SeatSchema.plugin(mongooseDelete);
// SeatSchema.plugin(mongooseAutopopulate);

type SeatDocument = Seat & mongoose.Document;

export { SeatSchema, SeatDocument };
