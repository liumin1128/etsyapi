import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataModule } from '@/utils/idata/idata.module';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsController } from './news.controller';

@Module({
  imports: [
    IDataModule,
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  providers: [NewsService, NewsResolver],
  exports: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
