import { Test, TestingModule } from '@nestjs/testing';
import { AdminMarketingService } from './admin-marketing.service';

describe('AdminMarketingService', () => {
  let service: AdminMarketingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminMarketingService],
    }).compile();

    service = module.get<AdminMarketingService>(AdminMarketingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
