import { Controller, Get } from '@nestjs/common';
import { InterestsService } from './interests.service';

@Controller('interests')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.interestsService.findAll();
  }
}
