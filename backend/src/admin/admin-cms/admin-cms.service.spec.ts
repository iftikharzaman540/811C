import { Test, TestingModule } from '@nestjs/testing';
import { AdminCmsService } from './admin-cms.service';

describe('AdminCmsService', () => {
  let service: AdminCmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCmsService],
    }).compile();

    service = module.get<AdminCmsService>(AdminCmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
