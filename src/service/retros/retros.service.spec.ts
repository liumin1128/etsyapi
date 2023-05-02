import { Test, TestingModule } from '@nestjs/testing';
import { RetrosService } from './retros.service';

describe('RetrosService', () => {
  let service: RetrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetrosService],
    }).compile();

    service = module.get<RetrosService>(RetrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
