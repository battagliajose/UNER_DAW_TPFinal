import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailEnlacesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  participationLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  consultationLink: string;
}
