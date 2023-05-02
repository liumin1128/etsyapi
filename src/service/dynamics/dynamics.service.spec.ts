import { Test, TestingModule } from '@nestjs/testing';
import { DynamicsService } from './dynamics.service';

describe('DynamicsService', () => {
  let service: DynamicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicsService],
    }).compile();

    service = module.get<DynamicsService>(DynamicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
