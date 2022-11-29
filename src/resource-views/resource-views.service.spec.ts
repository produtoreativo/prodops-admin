import { Test, TestingModule } from '@nestjs/testing';
import { ResourceViewsService } from './resource-views.service';

describe('ResourceViewsService', () => {
  let service: ResourceViewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceViewsService],
    }).compile();

    service = module.get<ResourceViewsService>(ResourceViewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
