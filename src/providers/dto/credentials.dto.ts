import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CredentialsDto {
  @IsNotEmpty()
  @ApiProperty()
  AWS_REGION: string;

  @IsNotEmpty()
  @ApiProperty()
  AWS_ACCESS_KEY_ID: string;

  @IsNotEmpty()
  @ApiProperty()
  AWS_SECRET_ACCESS_KEY: string;
}
