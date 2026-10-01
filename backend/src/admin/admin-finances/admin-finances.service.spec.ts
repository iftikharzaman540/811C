import { Test, TestingModule } from '@nestjs/testing';
import { AdminFinancesService } from './admin-finances.service';

describe('AdminFinancesService', () => {
  let service: AdminFinancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminFinancesService],
    }).compile();

    service = module.get<AdminFinancesService>(AdminFinancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
