import { Test, TestingModule } from '@nestjs/testing';
import { AdminKycService } from './admin-kyc.service';

describe('AdminKycService', () => {
  let service: AdminKycService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminKycService],
    }).compile();

    service = module.get<AdminKycService>(AdminKycService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
