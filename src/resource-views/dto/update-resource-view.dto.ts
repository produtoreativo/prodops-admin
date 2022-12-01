import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateResourceViewDto } from './create-resource-view.dto';

export class UpdateResourceViewDto extends PartialType(CreateResourceViewDto) {
  @ApiProperty()
  @IsOptional()
  @IsInt({ each: true })
  resources: number[];
}
