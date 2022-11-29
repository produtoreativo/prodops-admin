import { Injectable } from '@nestjs/common';
import { CreateResourceViewDto } from './dto/create-resource-view.dto';
import { UpdateResourceViewDto } from './dto/update-resource-view.dto';

@Injectable()
export class ResourceViewsService {
  create(createResourceViewDto: CreateResourceViewDto) {
    return 'This action adds a new resourceView';
  }

  findAll() {
    return `This action returns all resourceViews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resourceView`;
  }

  update(id: number, updateResourceViewDto: UpdateResourceViewDto) {
    return `This action updates a #${id} resourceView`;
  }

  remove(id: number) {
    return `This action removes a #${id} resourceView`;
  }
}
