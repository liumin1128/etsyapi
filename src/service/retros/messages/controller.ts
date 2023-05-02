import { Controller, Get, Query } from '@nestjs/common';

import { RetroMessagesService } from './service';

@Controller('retroMessages')
export class RetroMessagesController {
  constructor(private readonly retroMessagesService: RetroMessagesService) {}

  @Get()
  async findAll(@Query('retro') retro: string): Promise<any> {
    return this.retroMessagesService.findAll(retro);
  }
}
