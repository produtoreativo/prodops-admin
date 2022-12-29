import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElastiCache, ElasticBeanstalk, ResourceExplorer2 } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ProvidersModule } from '../providers/providers.module';
import { ResourceViewsModule } from '../resource-views/resource-views.module';
import { ResourcesModule } from '../resources/resources.module';
import { UserModule } from '../users/users.module';
import { Scan } from './entities/scan.entity';
import { ScansController } from './scans.controller';
import { ScansService } from './scans.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scan]),
    AwsSdkModule.forFeatures([ResourceExplorer2]),
    AwsSdkModule.forFeatures([ElastiCache]),
    AwsSdkModule.forFeatures([ElasticBeanstalk]),
    ResourceViewsModule,
    ProvidersModule,
    ResourcesModule,
    UserModule,
    OrganizationsModule,
  ],
  controllers: [ScansController],
  providers: [ScansService],
})
export class ScansModule {}
