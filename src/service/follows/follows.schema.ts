import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  from: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  to: mongoose.Types.ObjectId;

  @Prop()
  special: boolean;
}

const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.plugin(mongoosePaginate);
FollowSchema.plugin(mongooseDelete);

type FollowDocument = Follow & mongoose.Document;

export { FollowSchema, FollowDocument };
