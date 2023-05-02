import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

@Schema({ timestamps: true })
export class Product {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  cover: string;

  @Prop()
  stars: number;

  @Prop()
  commentCount: number;

  @Prop()
  html: string;
}

const ProductSchema = SchemaFactory.createForClass(Product);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(mongooseDelete);
// ProductSchema.plugin(mongooseAutopopulate);

type ProductDocument = Product & mongoose.Document;

export { ProductSchema, ProductDocument };
