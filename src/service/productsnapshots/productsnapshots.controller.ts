import { Controller, Get } from '@nestjs/common';
import { ProductSnapshotsService } from './productSnapshots.service';

@Controller('productSnapshots')
export class ProductSnapshotsController {
  constructor(
    private readonly productSnapshotsService: ProductSnapshotsService,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    const url =
      'https://www.etsy.com/uk/listing/1433263187/personalised-vintage-cap-custom';
    return this.productSnapshotsService.getProductSnapshot(url);
    // return this.productSnapshotsService.findAll();
  }
}
