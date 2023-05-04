import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';
import { ProductDocument } from '@/service/products/products.schema';

@Schema({ timestamps: true })
export class ProductSnapshot {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: ProductDocument;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  stars: number;

  @Prop({ type: Number })
  sales: number;

  @Prop({ type: Number })
  currencyValue: number;

  @Prop({ type: Number })
  reviews: number;

  @Prop({ type: Number })
  favorites: number;

  @Prop({ type: [String] })
  pictures: string[];

  @Prop({ type: [String] })
  kinds: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Boolean })
  starSeller: boolean;

  @Prop({ type: Boolean })
  etsyPick: boolean;

  @Prop({ type: Boolean })
  bestSeller: boolean;

  @Prop({ type: Boolean })
  freeShipping: boolean;
}

const ProductSnapshotSchema = SchemaFactory.createForClass(ProductSnapshot);

// https://stackoverflow.com/questions/49387454/mongoose-plugins-nestjs
ProductSnapshotSchema.plugin(mongoosePaginate);
ProductSnapshotSchema.plugin(mongooseDelete);
// ProductSnapshotSchema.plugin(mongooseAutopopulate);

type ProductSnapshotDocument = ProductSnapshot & mongoose.Document;

export { ProductSnapshotSchema, ProductSnapshotDocument };
