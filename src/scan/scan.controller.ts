import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import ViewDto from './view.dto';

@Controller('scan')
@ApiTags('playground')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get(':bucket')
  search(@Param('bucket') bucket: string) {
    return this.scanService.listBucketContents(bucket);
  }

  @Get()
  searchAll(@Query('arn') arn: string) {
    return this.scanService.search(arn);
  }

  @Post('create-view')
  createView(@Body() viewDto: ViewDto) {
    return this.scanService.createView(viewDto);
  }
}
