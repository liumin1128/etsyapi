import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';
import { ProductSnapshotsService } from './productsnapshots.service';
import { ProductSnapshotsResolver } from './productsnapshots.resolver';
import {
  ProductSnapshot,
  ProductSnapshotSchema,
} from './productsnapshots.schema';
import { ProductSnapshotsController } from './productsnapshots.controller';

@Module({
  imports: [
    HttpModule,
    QiniuModule,
    MongooseModule.forFeature([
      { name: ProductSnapshot.name, schema: ProductSnapshotSchema },
    ]),
  ],
  providers: [ProductSnapshotsService, ProductSnapshotsResolver],
  exports: [ProductSnapshotsService],
  controllers: [ProductSnapshotsController],
})
export class ProductSnapshotsModule {}
