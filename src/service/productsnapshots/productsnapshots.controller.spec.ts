import { Test, TestingModule } from '@nestjs/testing';
import { ProductSnapshotsController } from './productSnapshots.controller';

describe('ProductSnapshotsController', () => {
  let controller: ProductSnapshotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSnapshotsController],
    }).compile();

    controller = module.get<ProductSnapshotsController>(
      ProductSnapshotsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
