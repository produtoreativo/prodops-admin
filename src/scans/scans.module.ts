import { Module } from '@nestjs/common';
import { ScansService } from './scans.service';
import { ScansController } from './scans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scan } from './entities/scan.entity';
import { AwsSdkModule } from 'nest-aws-sdk';
import { ResourceExplorer2 } from 'aws-sdk';
import { ProvidersModule } from '../providers/providers.module';
import { ResourceViewsModule } from '../resource-views/resource-views.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scan]),
    AwsSdkModule.forFeatures([ResourceExplorer2]),
    ResourceViewsModule,
    ProvidersModule,
  ],
  controllers: [ScansController],
  providers: [ScansService],
})
export class ScansModule {}
