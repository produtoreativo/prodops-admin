import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const newProvider = new Provider();
    newProvider.name = createProviderDto.name;
    newProvider.content = createProviderDto.content;
    newProvider.credentials = createProviderDto.credentials;
    newProvider.organization = {
      id: createProviderDto.organizationId,
    } as Organization;
    return this.providersRepository.save(
      this.providersRepository.create(newProvider),
    );
  }

  findAll() {
    return this.providersRepository.find();
  }

  async findOne(id: number) {
    const provider = await this.providersRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!provider) {
      throw new NotFoundException();
    }
    return provider;
  }

  async update(id: number, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providersRepository.preload({
      id,
      ...{
        name: updateProviderDto.name,
        content: updateProviderDto.content,
        credentials: updateProviderDto.credentials,
        organization: { id: updateProviderDto.organizationId },
      },
    });
    if (!provider) {
      throw new NotFoundException();
    }
    return this.providersRepository.save(provider);
  }

  async remove(id: number) {
    const provider = await this.findOne(id);
    await this.providersRepository.remove(provider);
  }
}
