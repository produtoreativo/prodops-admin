import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto) {
    const newResource = this.resourceRepository.create({
      name: createResourceDto.name,
      organization: { id: createResourceDto.organizationId },
      provider: { id: createResourceDto.providerId },
      scanContent: createResourceDto.scanContent,
    });
    return this.resourceRepository.save(newResource);
  }

  async findAll() {
    return this.resourceRepository.find();
  }

  async findOne(id: number) {
    const resource = await this.resourceRepository.findOne({
      relations: ['organization', 'provider', 'resourceViews', 'scans'],
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
