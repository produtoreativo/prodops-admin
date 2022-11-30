import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @ApiProperty()
  region: string;

  @IsNotEmpty()
  @ApiProperty()
  accessKeyId: string;

  @IsNotEmpty()
  @ApiProperty()
  secretAccessKey: string;
}
