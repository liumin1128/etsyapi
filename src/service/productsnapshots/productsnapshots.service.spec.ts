import { Test, TestingModule } from '@nestjs/testing';
import { ProductSnapshotsService } from './productsnapshots.service';

describe('ProductSnapshotsService', () => {
  let service: ProductSnapshotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductSnapshotsService],
    }).compile();

    service = module.get<ProductSnapshotsService>(ProductSnapshotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
