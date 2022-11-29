import { Test, TestingModule } from '@nestjs/testing';
import { ResourceViewsController } from './resource-views.controller';
import { ResourceViewsService } from './resource-views.service';

describe('ResourceViewsController', () => {
  let controller: ResourceViewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceViewsController],
      providers: [ResourceViewsService],
    }).compile();

    controller = module.get<ResourceViewsController>(ResourceViewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
