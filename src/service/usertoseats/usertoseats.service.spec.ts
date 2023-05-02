import { Test, TestingModule } from '@nestjs/testing';
import { UserToSeatsService } from './usertoseats.service';

describe('UserToSeatsService', () => {
  let service: UserToSeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserToSeatsService],
    }).compile();

    service = module.get<UserToSeatsService>(UserToSeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
