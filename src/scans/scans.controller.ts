import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ScansService } from './scans.service';
import { CreateScanDto } from './dto/create-scan.dto';
import { UpdateScanDto } from './dto/update-scan.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenAuthGuard } from '../auth/guard/jwt-access.guard';
import { UserEntity } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('Scans')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('scans')
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post()
  create(@Body() createScanDto: CreateScanDto) {
    return this.scansService.create(createScanDto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.scansService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scansService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScanDto: UpdateScanDto) {
    return this.scansService.update(+id, updateScanDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scansService.remove(+id);
  }
}
