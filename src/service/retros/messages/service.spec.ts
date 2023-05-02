import { Test, TestingModule } from '@nestjs/testing';
import { RetroMessagesService } from './service';

describe('RetroMessagesService', () => {
  let service: RetroMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetroMessagesService],
    }).compile();

    service = module.get<RetroMessagesService>(RetroMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
