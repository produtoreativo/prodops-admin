import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceExplorer2 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Repository } from 'typeorm';
import { Credentials } from '../providers/credentials.type';
import { ProvidersService } from '../providers/providers.service';
import { ResourceViewsService } from '../resource-views/resource-views.service';
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

    return 'This action adds a new scan';
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
