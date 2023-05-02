import { Test, TestingModule } from '@nestjs/testing';
import { UserToOrganizationsService } from './usertoorganizations.service';

describe('UserToOrganizationsService', () => {
  let service: UserToOrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserToOrganizationsService],
    }).compile();

    service = module.get<UserToOrganizationsService>(
      UserToOrganizationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
