import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class Hashtag {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['Game', 'Pet', 'Digital', 'Peripherals', 'Other'],
  })
  category: string;

  @Prop()
  name: string;

  @Prop()
  cover: string;

  @Prop()
  icon: string;
}

const HashtagSchema = SchemaFactory.createForClass(Hashtag);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
HashtagSchema.plugin(mongoosePaginate);
HashtagSchema.plugin(mongooseDelete);
// HashtagSchema.plugin(mongooseAutopopulate);

type HashtagDocument = Hashtag & mongoose.Document;

export { HashtagSchema, HashtagDocument };
