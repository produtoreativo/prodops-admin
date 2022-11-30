import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CredentialsDto } from './credentials.dto';

export class CreateProviderDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CredentialsDto)
  @ApiProperty({ type: CredentialsDto })
  credentials: CredentialsDto;

  @IsNotEmpty()
  @ApiProperty()
  organizationId: number;
}
