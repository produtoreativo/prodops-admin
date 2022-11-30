import { Module } from '@nestjs/common';
import { ResourceViewsService } from './resource-views.service';
import { ResourceViewsController } from './resource-views.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceView } from './entities/resource-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceView])],
  controllers: [ResourceViewsController],
  providers: [ResourceViewsService],
})
export class ResourceViewsModule {}
