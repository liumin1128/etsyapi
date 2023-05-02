import { Controller, Get } from '@nestjs/common';
import { RetrosService } from './retros.service';
import { CurrentUser } from '@/service/auth/auth.guard';
import { SignUserPayload } from '@/service/auth/auth.service';

@Controller('retros')
export class RetrosController {
  constructor(private readonly retrosService: RetrosService) {}

  @Get()
  async findAll(@CurrentUser() user: SignUserPayload): Promise<any> {
    return this.retrosService.findAll({ pageSize: 10 });
  }
}
