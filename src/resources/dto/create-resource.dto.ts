import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  scanContent: Record<string, any>;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  organizationId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  providerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  resourceViewId: number;
}
