import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
// import * as mongooseAutopopulate from 'mongoose-autopopulate';

// const PriceSchema = new mongoose.Schema({
//   currencyValue: { type: Number, required: true },
//   currencySymbol: { type: String, required: true },
// });

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  cover: string;

  @Prop({ type: Number })
  stars: number;

  @Prop({ type: Number })
  commentCount: number;

  @Prop({ type: Number })
  currencyValue: number;

  @Prop({ type: String })
  currencySymbol: string;

  @Prop({ type: Number })
  originalCurrencyValue: number;

  @Prop({ type: String })
  originalCurrencySymbol: string;

  @Prop({ type: Boolean })
  starSeller: boolean;

  @Prop({ type: [String] })
  tags: string[];
}

const ProductSchema = SchemaFactory.createForClass(Product);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
ProductSchema.plugin(mongoosePaginate);
ProductSchema.plugin(mongooseDelete);
// ProductSchema.plugin(mongooseAutopopulate);

type ProductDocument = Product & mongoose.Document;

export { ProductSchema, ProductDocument };
