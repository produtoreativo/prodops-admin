import { Injectable } from '@nestjs/common';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3, ResourceExplorer2 } from 'aws-sdk';
import ViewDto from './view.dto';

@Injectable()
export class ScanService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    @InjectAwsService(ResourceExplorer2) private readonly res: ResourceExplorer2,
  ) {
  }

  async listBucketContents(bucket: string) {
    const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    return response.Contents.map(c => c.Key);
  }

  async createView(viewDto: ViewDto) {
    return new Promise((resolve, reject) => {
      const params: ResourceExplorer2.CreateViewInput  = {
        ViewName: viewDto.name, 
      };
      //find
      // if exist return message
      // else
      this.res.createView(params, function(err, data) {
        console.log('entrou o create'), err, data
        if(err) {
          reject(err);
        } else {
          //grava no banco
          resolve(data);
        }
      });
    });
  }

  async search(ViewArn: string) {
    return new Promise((resolve, reject) => {
      const params: ResourceExplorer2.SearchInput  = {
        // QueryString: 'AWS::Lambda::Function',
        QueryString: '*',
        MaxResults: 100,
        // NextToken
        ViewArn, 
      };
      this.res.search(params, function (err, data) {
        console.log('entrou o search', err, data)
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }

}