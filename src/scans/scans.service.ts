import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElastiCache, ElasticBeanstalk, ResourceExplorer2 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Repository } from 'typeorm';
import { OrganizationsService } from '../organizations/organizations.service';
import { Credentials } from '../providers/credentials.type';
import { ProvidersService } from '../providers/providers.service';
import { ResourceView } from '../resource-views/entities/resource-view.entity';
import { ResourceViewsService } from '../resource-views/resource-views.service';
import { Resource } from '../resources/entities/resource.entity';
import { ResourcesService } from '../resources/resources.service';
import { UserEntity } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateScanDto } from './dto/create-scan.dto';
import { UpdateScanDto } from './dto/update-scan.dto';
import { Scan } from './entities/scan.entity';

interface CommonResourceType {
  name: string;
  json: Record<string, any>;
}

@Injectable()
export class ScansService {
  constructor(
    @InjectRepository(Scan)
    private readonly scansRepository: Repository<Scan>,
    @InjectAwsService(ResourceExplorer2)
    private readonly resourceExplorer: ResourceExplorer2,
    @InjectAwsService(ElastiCache)
    private readonly ec: ElastiCache,
    @InjectAwsService(ElasticBeanstalk)
    private readonly ebs: ElasticBeanstalk,
    private readonly resourceViewsService: ResourceViewsService,
    private readonly providerService: ProvidersService,
    private readonly resourcesService: ResourcesService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  private setupCredentialsForResourceExplorer(credentials: Credentials) {
    this.resourceExplorer.config.credentials.accessKeyId =
      credentials.accessKeyId;
    this.resourceExplorer.config.credentials.secretAccessKey =
      credentials.secretAccessKey;
    this.resourceExplorer.config.region = credentials.region;
  }

  private async listElasticCache(): Promise<CommonResourceType[]> {
    const { CacheClusters } = await this.ec.describeCacheClusters().promise();
    return CacheClusters.map((cacheCluster) => ({
      name: cacheCluster.ARN,
      json: cacheCluster,
    }));
  }
  private async listElasticBeanstalk(): Promise<CommonResourceType[]> {
    const { Applications } = await this.ebs.describeApplications().promise();
    return Applications.map((app) => ({ name: app.ApplicationArn, json: app }));
  }
  private async listResourcesExplorer(
    resourceView: ResourceView,
  ): Promise<CommonResourceType[]> {
    const params: ResourceExplorer2.SearchInput = {
      QueryString: '*',
      MaxResults: 50,
      ViewArn: resourceView.arn,
    };
    const resources = [];
    let response = await this.resourceExplorer.search(params).promise();
    resources.push(...response.Resources);

    while ('NextToken' in response) {
      params.NextToken = response.NextToken;
      response = await this.resourceExplorer.search(params).promise();
      resources.push(...response.Resources);
    }
    return resources.map((resource) => ({
      name: resource.Arn,
      json: resource,
    }));
  }

  async create(createScanDto: CreateScanDto) {
    const provider = await this.providerService.findOne(
      createScanDto.providerId,
    );
    const resourceView = await this.resourceViewsService.findOne(
      createScanDto.resourceViewId,
    );

    this.setupCredentialsForResourceExplorer(provider.credentials);

    const resources: CommonResourceType[] = [];
    resources.push(...(await this.listResourcesExplorer(resourceView)));
    resources.push(...(await this.listElasticBeanstalk()));
    resources.push(...(await this.listElasticCache()));

    console.log('LENGTH :: ' + resources.length);

    const storedResources: Resource[] = [];
    for (const resource of resources) {
      const storedResource = await this.resourcesService.create({
        name: resource.name,
        organizationId: provider.organization.id,
        scanContent: resource.json,
        providerId: provider.id,
      });
      storedResources.push(storedResource);
    }

    const newScan = new Scan();
    newScan.name = createScanDto.name;
    newScan.provider = provider;
    newScan.resourceView = resourceView;
    newScan.resources = storedResources;

    return this.scansRepository.save(newScan);
  }

  async findAll(user: UserEntity) {
    const organizations = await this.usersService.listOrganizationsOfUser(
      user.id,
    );
    const providers = [];
    for (const organization of organizations) {
      providers.push(
        ...(await this.organizationsService.listProvidersOfOrganization(
          organization.id,
        )),
      );
    }
    const resourcesViews = [];
    for (const provider of providers) {
      resourcesViews.push(
        ...(await this.providerService.listResourcesViewOfProvider(
          provider.id,
        )),
      );
    }
    const scans = [];
    for (const resourcesView of resourcesViews) {
      scans.push(
        ...(await this.resourceViewsService.listScansOfResourcesView(
          resourcesView.id,
        )),
      );
    }
    return scans;
  }

  findOne(id: number) {
    return this.scansRepository.findOne({
      where: { id },
      relations: ['provider', 'resourceView', 'resources'],
    });
  }

  update(id: number, updateScanDto: UpdateScanDto) {
    return `This action updates a #${id} scan`;
  }

  remove(id: number) {
    return `This action removes a #${id} scan`;
  }
}
