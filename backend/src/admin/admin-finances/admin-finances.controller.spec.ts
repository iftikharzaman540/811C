import { Test, TestingModule } from '@nestjs/testing';
import { AdminFinancesController } from './admin-finances.controller';

describe('AdminFinancesController', () => {
  let controller: AdminFinancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminFinancesController],
    }).compile();

    controller = module.get<AdminFinancesController>(AdminFinancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
