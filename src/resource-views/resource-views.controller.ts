import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceViewsService } from './resource-views.service';
import { CreateResourceViewDto } from './dto/create-resource-view.dto';
import { UpdateResourceViewDto } from './dto/update-resource-view.dto';

@Controller('resource-views')
export class ResourceViewsController {
  constructor(private readonly resourceViewsService: ResourceViewsService) {}

  @Post()
  create(@Body() createResourceViewDto: CreateResourceViewDto) {
    return this.resourceViewsService.create(createResourceViewDto);
  }

  @Get()
  findAll() {
    return this.resourceViewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceViewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResourceViewDto: UpdateResourceViewDto) {
    return this.resourceViewsService.update(+id, updateResourceViewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceViewsService.remove(+id);
  }
}
