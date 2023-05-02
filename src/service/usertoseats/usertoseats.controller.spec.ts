import { Test, TestingModule } from '@nestjs/testing';
import { UserToSeatsController } from './usertoseats.controller';

describe('UserToSeatsController', () => {
  let controller: UserToSeatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserToSeatsController],
    }).compile();

    controller = module.get<UserToSeatsController>(UserToSeatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
