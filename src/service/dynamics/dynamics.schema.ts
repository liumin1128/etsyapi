import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';
import { UserDocument } from '@/service/users/schemas/users.schema';

@Schema({ timestamps: true })
export class Dynamic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop()
  content: string;

  @Prop()
  pictures: string[];
}

const DynamicSchema = SchemaFactory.createForClass(Dynamic);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
DynamicSchema.plugin(mongoosePaginate);
DynamicSchema.plugin(mongooseDelete);
// DynamicSchema.plugin(mongooseAutopopulate);

type DynamicDocument = Dynamic & mongoose.Document;

export { DynamicSchema, DynamicDocument };
