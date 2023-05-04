import { Controller, Get } from '@nestjs/common';
import { ProductSnapshotsService } from './productsnapshots.service';

@Controller('productSnapshots')
export class ProductSnapshotsController {
  constructor(
    private readonly productSnapshotsService: ProductSnapshotsService,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    const url =
      'https://www.etsy.com/listing/464741299/waynes-world-embroidered-cotton-twill-tv?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=&ref=sr_gallery-2-46&frs=1&bes=1&sts=1&organic_search_click=1';
    return this.productSnapshotsService.getProductSnapshot(url);
    // return this.productSnapshotsService.findAll();
  }
}
