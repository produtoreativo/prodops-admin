import { Module } from '@nestjs/common';
import { AwsSdkModule } from 'nest-aws-sdk';
import { ElastiCache, ElasticBeanstalk, ResourceExplorer2, S3 } from 'aws-sdk';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';

@Module({
  imports: [
    AwsSdkModule.forFeatures([S3]),
    AwsSdkModule.forFeatures([ResourceExplorer2]),
    AwsSdkModule.forFeatures([ElastiCache]),
    AwsSdkModule.forFeatures([ElasticBeanstalk]),
  ],
  controllers: [ScanController],
  providers: [ScanService],
  exports: [ScanService],
})
export class ScanModule {}
