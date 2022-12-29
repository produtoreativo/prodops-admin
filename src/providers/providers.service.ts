import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
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

  async findAll(user: UserEntity) {
    const providers = [];
    const organizations = await this.usersService.listOrganizationsOfUser(
      user.id,
    );
    for (const organization of organizations) {
      providers.push(
        ...(await this.organizationsService.listProvidersOfOrganization(
          organization.id,
        )),
      );
    }
    return providers;
  }

  async listResourcesViewOfProvider(providerId: number) {
    const { resourceViews } = await this.findOne(providerId);
    return resourceViews;
  }

  async findOne(id: number) {
    const provider = await this.providersRepository.findOne({
      where: { id },
      relations: ['organization', 'resourceViews'],
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
