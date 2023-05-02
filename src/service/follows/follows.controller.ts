import { Controller, Get } from '@nestjs/common';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.followsService.findAll();
  }
}
