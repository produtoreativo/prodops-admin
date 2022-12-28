import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessTokenAuthGuard } from '../auth/guard/jwt-access.guard';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(
    @GetUser() user: UserEntity,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(user, createOrganizationDto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.organizationsService.findAll(user);
  }

  @ApiOkResponse({ status: 200, description: 'Organization found' })
  @ApiNotFoundResponse({ status: 404, description: 'Organization not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiNotFoundResponse({ status: 404, description: 'Organization not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
