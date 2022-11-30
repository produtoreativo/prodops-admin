import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3, ResourceExplorer2 } from 'aws-sdk';
import ViewDto from './view.dto';

@Injectable()
export class ScanService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    @InjectAwsService(ResourceExplorer2)
    private readonly res: ResourceExplorer2,
  ) {}

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map((c) => c.Key);
  }

  async createView(viewDto: ViewDto) {
    const params: ResourceExplorer2.CreateViewInput = {
      ViewName: viewDto.name,
    };
    const response = await this.res.createView(params).promise();
    const { ViewArn } = response.View;
    return ViewArn;
  }

  async search(ViewArn: string) {
    const params: ResourceExplorer2.SearchInput = {
      QueryString: '*',
      MaxResults: 50,
      ViewArn,
    };
    const resources = [];
    let response = await this.res.search(params).promise();
    resources.push(...response.Resources);

    while ('NextToken' in response) {
      params.NextToken = response.NextToken;
      response = await this.res.search(params).promise();
      resources.push(...response.Resources);
    }

    return resources;
  }
}
