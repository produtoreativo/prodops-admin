import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateScanDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  resourceViewId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  providerId: number; //redundant
}
