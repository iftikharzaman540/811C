import { Test, TestingModule } from '@nestjs/testing';
import { AdminSupportController } from './admin-support.controller';

describe('AdminSupportController', () => {
  let controller: AdminSupportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSupportController],
    }).compile();

    controller = module.get<AdminSupportController>(AdminSupportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
