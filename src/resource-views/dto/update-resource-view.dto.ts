import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceViewDto } from './create-resource-view.dto';

export class UpdateResourceViewDto extends PartialType(CreateResourceViewDto) {}
