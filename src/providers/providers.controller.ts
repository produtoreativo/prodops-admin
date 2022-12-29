import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessTokenAuthGuard } from '../auth/guard/jwt-access.guard';
import { UserEntity } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('Providers')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  findAll(@GetUser() user: UserEntity) {
    return this.providersService.findAll(user);
  }

  @ApiOkResponse({ status: 200, description: 'Provider found' })
  @ApiNotFoundResponse({ status: 404, description: 'Provider not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(+id, updateProviderDto);
  }

  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiNotFoundResponse({ status: 404, description: 'Provider not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.providersService.remove(+id);
  }
}
