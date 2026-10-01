import { Test, TestingModule } from '@nestjs/testing';
import { AdminMarketingController } from './admin-marketing.controller';

describe('AdminMarketingController', () => {
  let controller: AdminMarketingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMarketingController],
    }).compile();

    controller = module.get<AdminMarketingController>(AdminMarketingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
