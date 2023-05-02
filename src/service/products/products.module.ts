import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product, ProductSchema } from './products.schema';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    HttpModule,
    QiniuModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
