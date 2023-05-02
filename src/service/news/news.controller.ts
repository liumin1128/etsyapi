import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';
// import { Cat } from './interfaces/cat.interface';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('idata')
  async getNewsFromIData(): Promise<any> {
    return this.newsService.getNewsFromIData();
  }

  @Get()
  async findAll(): Promise<any> {
    return this.newsService.findAll();
  }
}
