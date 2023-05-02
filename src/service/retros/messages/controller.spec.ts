import { Test, TestingModule } from '@nestjs/testing';
import { RetroMessagesController } from './controller';

describe('RetroMessagesController', () => {
  let controller: RetroMessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RetroMessagesController],
    }).compile();

    controller = module.get<RetroMessagesController>(RetroMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
