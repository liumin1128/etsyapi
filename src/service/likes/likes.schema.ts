import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  // 对象
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'objectModel',
    autopopulate: true,
    required: true,
  })
  object: mongoose.Types.ObjectId | string;

  @Prop({
    required: true,
    enum: ['Dynamic', 'News', 'Comment', 'RetroMessage'],
  })
  objectModel: string;
}

const LikeSchema = SchemaFactory.createForClass(Like);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
LikeSchema.plugin(mongoosePaginate);
LikeSchema.plugin(mongooseDelete);
// LikeSchema.plugin(mongooseAutopopulate);

type LikeDocument = Like & mongoose.Document;

export { LikeSchema, LikeDocument };
