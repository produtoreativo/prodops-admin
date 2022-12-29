import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceViewsService } from './resource-views.service';
import { CreateResourceViewDto } from './dto/create-resource-view.dto';
import { UpdateResourceViewDto } from './dto/update-resource-view.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenAuthGuard } from '../auth/guard/jwt-access.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';

@ApiTags('ResourceViews')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('resource-views')
export class ResourceViewsController {
  constructor(private readonly resourceViewsService: ResourceViewsService) {}

  @Post()
  create(@Body() createResourceViewDto: CreateResourceViewDto) {
    return this.resourceViewsService.create(createResourceViewDto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.resourceViewsService.findAll(user);
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceViewsService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceViewDto: UpdateResourceViewDto,
  ) {
    return this.resourceViewsService.update(+id, updateResourceViewDto);
  }
  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceViewsService.remove(+id);
  }
}
