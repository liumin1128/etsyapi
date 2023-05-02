import { Test, TestingModule } from '@nestjs/testing';
import { RetrosController } from './retros.controller';

describe('RetrosController', () => {
  let controller: RetrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetrosController],
    }).compile();

    controller = module.get<RetrosController>(RetrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
