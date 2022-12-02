import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceExplorer2 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Repository } from 'typeorm';
import { Credentials } from '../providers/credentials.type';
import { ProvidersService } from '../providers/providers.service';
import { CreateResourceViewDto } from './dto/create-resource-view.dto';
import { UpdateResourceViewDto } from './dto/update-resource-view.dto';
import { ResourceView } from './entities/resource-view.entity';

@Injectable()
export class ResourceViewsService {
  constructor(
    @InjectRepository(ResourceView)
    private readonly resourceViewRepository: Repository<ResourceView>,
    @InjectAwsService(ResourceExplorer2)
    private readonly resourceExplorer: ResourceExplorer2,
    private readonly providerService: ProvidersService,
  ) {}

  private setupCredentialsForResourceExplorer(credentials: Credentials) {
    this.resourceExplorer.config.credentials.accessKeyId =
      credentials.accessKeyId;
    this.resourceExplorer.config.credentials.secretAccessKey =
      credentials.secretAccessKey;
    this.resourceExplorer.config.region = credentials.region;
  }

  async create(createResourceViewDto: CreateResourceViewDto) {
    const provider = await this.providerService.findOne(
      createResourceViewDto.providerId,
    );

    // this.setupCredentialsForResourceExplorer(provider.credentials);

    const params: ResourceExplorer2.CreateViewInput = {
      ViewName: createResourceViewDto.name,
    };
    const response = await this.resourceExplorer.createView(params).promise();
    const { ViewArn } = response.View;

    const newResourceView = this.resourceViewRepository.create({
      name: createResourceViewDto.name,
      arn: ViewArn,
      provider: { id: createResourceViewDto.providerId },
    });
    return this.resourceViewRepository.save(newResourceView);
  }

  async findAll() {
    return this.resourceViewRepository.find();
  }

  async findOne(id: number) {
    const resourceView = await this.resourceViewRepository.findOne({
      where: { id },
      relations: ['provider', 'resources', 'scans'],
    });
    if (!resourceView) {
      throw new NotFoundException();
    }

    return resourceView;
  }

  async update(id: number, updateResourceViewDto: UpdateResourceViewDto) {
    const { resources, ...others } = updateResourceViewDto;
    let resourceView = await this.findOne(id);
    resourceView = { ...resourceView, ...others };
    if (resources) {
      const newResources = new Set(resourceView.resources.map((res) => res.id));
      resources.forEach((res) => newResources.add(res));
      const newResourcesArray = [];
      for (const id of newResources.values()) {
        newResourcesArray.push({ id });
      }
      resourceView.resources = newResourcesArray;
    }
    return this.resourceViewRepository.save(resourceView);
  }

  remove(id: number) {
    return `This action removes a #${id} resourceView`;
  }
}
