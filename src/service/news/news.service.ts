import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataService } from '@/utils/idata/idata.service';
import { CreateNewsDto } from './dto/create.dto';
import { News, NewsDocument } from './schemas/news.schema';
import { formatNews } from './news.utils';

@Injectable()
export class NewsService {
  constructor(
    private readonly idataService: IDataService,
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<NewsDocument> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(): Promise<NewsDocument[]> {
    const data = await this.newsModel.find();
    return data;
  }

  async findById(_id: string): Promise<NewsDocument> {
    const data = await this.newsModel.findById(_id);
    return data;
  }

  async getNewsFromIData(): Promise<NewsDocument> {
    try {
      const data = await this.idataService.getNewList({ keyword: 'switch' });

      await Promise.all(
        data.data.map(async (i) => {
          try {
            const doc = await this.newsModel.findOne({
              $or: [
                { 'origin.data.id': i.id },
                { 'origin.data.title': i.title },
              ],
            });

            if (doc) {
              console.log('已存在：', i.title);
              return;
            }

            const origin_news = await this.idataService.formatOriginNews(i);
            const news = formatNews(origin_news);
            await this.newsModel.create(news);
            console.log('已写入：', i.title);
          } catch (error) {
            console.log(`写入失败：${i.title}`);
            console.log(error);
          }
        }),
      );

      return;
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}
