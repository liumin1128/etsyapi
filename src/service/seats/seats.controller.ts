import { Controller, Get } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.seatsService.findAll();
  }
}
