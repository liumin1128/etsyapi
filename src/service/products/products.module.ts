import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';
import { ProductSnapshotsModule } from '@/service/productsnapshots/productsnapshots.module';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product, ProductSchema } from './products.schema';
import { ProductsController } from './products.controller';

import {
  ProductSnapshot,
  ProductSnapshotSchema,
} from '@/service/productsnapshots/productsnapshots.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductSnapshot.name, schema: ProductSnapshotSchema },
    ]),
    HttpModule,
    QiniuModule,
    ProductSnapshotsModule,
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
