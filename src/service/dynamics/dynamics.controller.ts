import { Controller, Get } from '@nestjs/common';
import { DynamicsService } from './dynamics.service';

@Controller('dynamics')
export class DynamicsController {
  constructor(private readonly dynamicsService: DynamicsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.dynamicsService.find();
  }
}
