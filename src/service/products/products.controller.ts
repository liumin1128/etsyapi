import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.productsService.fetchData();
  }

  @Get('/proxy')
  async getProxy(): Promise<any> {
    return this.productsService.getRandomAgent();
  }
}
