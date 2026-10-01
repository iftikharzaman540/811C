import { Test, TestingModule } from '@nestjs/testing';
import { AdminSupportService } from './admin-support.service';

describe('AdminSupportService', () => {
  let service: AdminSupportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminSupportService],
    }).compile();

    service = module.get<AdminSupportService>(AdminSupportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
