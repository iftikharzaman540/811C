import { Test, TestingModule } from '@nestjs/testing';
import { AdminCmsController } from './admin-cms.controller';

describe('AdminCmsController', () => {
  let controller: AdminCmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCmsController],
    }).compile();

    controller = module.get<AdminCmsController>(AdminCmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
