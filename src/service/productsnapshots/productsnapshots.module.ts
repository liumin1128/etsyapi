import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';
import { ProductSnapshotsService } from './productSnapshots.service';
import { ProductSnapshotsResolver } from './productSnapshots.resolver';
import {
  ProductSnapshot,
  ProductSnapshotSchema,
} from './productSnapshots.schema';
import { ProductSnapshotsController } from './productSnapshots.controller';

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
