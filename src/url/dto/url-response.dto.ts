import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({
    description: 'URL ID',
  })
  id!: number;

  @ApiProperty({
    description: 'Original long URL',
  })
  url!: string;

  @ApiProperty({
    description: 'Short code for the URL',
  })
  shortCode!: string;

  @ApiProperty({
    description: 'Number of clicks',
  })
  clicks?: number;

  @ApiProperty({
    description: 'Created date',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Updated date',
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Expiration date',
    required: false,
  })
  expiresAt?: Date;
}
