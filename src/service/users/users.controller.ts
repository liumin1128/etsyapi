import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
// import { Cat } from './interfaces/cat.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly newsService: UsersService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.newsService.findAll();
  }
}
