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
export class ProductSnapshot {
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

const ProductSnapshotSchema = SchemaFactory.createForClass(ProductSnapshot);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
ProductSnapshotSchema.plugin(mongoosePaginate);
ProductSnapshotSchema.plugin(mongooseDelete);
// ProductSnapshotSchema.plugin(mongooseAutopopulate);

type ProductSnapshotDocument = ProductSnapshot & mongoose.Document;

export { ProductSnapshotSchema, ProductSnapshotDocument };
