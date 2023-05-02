import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Origin {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  url: string;

  @Prop()
  data: mongoose.Schema.Types.Map;
}

@Schema({ timestamps: true })
export class News {
  @Prop()
  title: string;

  @Prop()
  cover: string;

  @Prop()
  json: string;

  @Prop()
  html: string;

  @Prop()
  content: string;

  @Prop()
  catLabel1: string;

  @Prop()
  catLabel2: string;

  @Prop()
  showHtml: boolean;

  @Prop({ type: Array })
  tags: string[];

  @Prop({ type: Array })
  photos: string[];

  @Prop({ type: Origin })
  origin: mongoose.Schema.Types.Map;
}

export const NewsSchema = SchemaFactory.createForClass(News);

export type NewsDocument = News & mongoose.Document;
