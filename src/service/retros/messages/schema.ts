import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';
import { UserDocument } from '@/service/users/schemas/users.schema';
import { RetroDocument } from '@/service/retros/retros.schema';

@Schema({ timestamps: true })
export class RetroMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Retro' })
  retro: RetroDocument;

  @Prop()
  content: string;

  @Prop({ enum: ['NORMAL', 'CLOSED', 'FOCUSED'], default: 'NORMAL' })
  status: string;

  @Prop({ enum: ['HAPPY', 'WONDERRING', 'UNHAPPY', 'TODO'], default: 'HAPPY' })
  type: string;

  @Prop()
  like: number;

  @Prop({ default: false })
  anonymous: boolean;

  @Prop()
  pictures: string[];
}

const RetroMessageSchema = SchemaFactory.createForClass(RetroMessage);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
RetroMessageSchema.plugin(mongoosePaginate);
RetroMessageSchema.plugin(mongooseDelete, { overrideMethods: true });
// RetroMessageSchema.plugin(mongooseAutopopulate);

type RetroMessageDocument = RetroMessage & mongoose.Document;

export { RetroMessageSchema, RetroMessageDocument };
