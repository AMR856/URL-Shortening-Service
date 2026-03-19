import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    example: 'https://example.com/very/long/link',
    description: 'The long URL to shorten',
  })
  @IsUrl()
  url!: string;
}
