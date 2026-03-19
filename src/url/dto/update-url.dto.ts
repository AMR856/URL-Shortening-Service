import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({
    example: 'https://example.com/new/long/link',
    description: 'The new long URL',
  })
  @IsUrl()
  url!: string;
}
