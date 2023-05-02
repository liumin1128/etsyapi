import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class Topic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({
    // required: true,
    enum: ['Game', 'Pet', 'Digital', 'Peripherals', 'Other'],
  })
  category: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  cover: string;

  @Prop()
  icon: string;
}

const TopicSchema = SchemaFactory.createForClass(Topic);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
TopicSchema.plugin(mongoosePaginate);
TopicSchema.plugin(mongooseDelete);
// TopicSchema.plugin(mongooseAutopopulate);

type TopicDocument = Topic & mongoose.Document;

export { TopicSchema, TopicDocument };
