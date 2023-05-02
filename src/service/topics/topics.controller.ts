import { Controller, Get } from '@nestjs/common';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.topicsService.findAll();
  }
}
