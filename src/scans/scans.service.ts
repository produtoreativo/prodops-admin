import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceExplorer2 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Repository } from 'typeorm';
import { Credentials } from '../providers/credentials.type';
import { ProvidersService } from '../providers/providers.service';
import { ResourceViewsService } from '../resource-views/resource-views.service';
import { Resource } from '../resources/entities/resource.entity';
import { ResourcesService } from '../resources/resources.service';
import { CreateScanDto } from './dto/create-scan.dto';
import { UpdateScanDto } from './dto/update-scan.dto';
import { Scan } from './entities/scan.entity';

@Injectable()
export class ScansService {
  constructor(
    @InjectRepository(Scan)
    private readonly scansRepository: Repository<Scan>,
    @InjectAwsService(ResourceExplorer2)
    private readonly resourceExplorer: ResourceExplorer2,
    private readonly resourceViewsService: ResourceViewsService,
    private readonly providerService: ProvidersService,
    private readonly resourcesService: ResourcesService,
  ) {}

  private setupCredentialsForResourceExplorer(credentials: Credentials) {
    this.resourceExplorer.config.credentials.accessKeyId =
      credentials.accessKeyId;
    this.resourceExplorer.config.credentials.secretAccessKey =
      credentials.secretAccessKey;
    this.resourceExplorer.config.region = credentials.region;
  }

  async create(createScanDto: CreateScanDto) {
    const provider = await this.providerService.findOne(
      createScanDto.providerId,
    );
    const resourceView = await this.resourceViewsService.findOne(
      createScanDto.resourceViewId,
    );

    // this.setupCredentialsForResourceExplorer(provider.credentials);

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

    const storedResources: Resource[] = [];
    for (const resource of resources) {
      const storedResource = await this.resourcesService.create({
        name: resource.Arn,
        organizationId: provider.organization.id,
        resourceViewId: resourceView.id,
        scanContent: resource,
        providerId: provider.id,
      });
      storedResources.push(storedResource);
    }

    const newScan = new Scan();
    newScan.name = createScanDto.name;
    newScan.provider = provider;
    newScan.resourceView = resourceView;
    newScan.resources = storedResources;

    await this.resourceViewsService.update(resourceView.id, {
      resources: storedResources.map((res) => res.id),
    });

    return this.scansRepository.save(newScan);
  }

  findAll() {
    return `This action returns all scans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scan`;
  }

  update(id: number, updateScanDto: UpdateScanDto) {
    return `This action updates a #${id} scan`;
  }

  remove(id: number) {
    return `This action removes a #${id} scan`;
  }
}
