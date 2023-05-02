import { Test, TestingModule } from '@nestjs/testing';
import { DynamicsController } from './dynamics.controller';

describe('DynamicsController', () => {
  let controller: DynamicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicsController],
    }).compile();

    controller = module.get<DynamicsController>(DynamicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
