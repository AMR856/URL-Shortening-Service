import { ApiProperty } from '@nestjs/swagger';

export class UrlEntity {
  @ApiProperty({
    description: 'URL ID',
  })
  id!: number;

  @ApiProperty({
    description: 'Original long URL',
  })
  url!: string;

  @ApiProperty({
    description: 'Unique short code',
  })
  shortCode!: string;

  @ApiProperty({
    description: 'Number of times the short code has been accessed',
  })
  clicks!: number;

  @ApiProperty({
    description: 'Date when the URL was created',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Date when the URL was last updated',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Expiration date of the URL',
    nullable: true,
  })
  expiresAt!: Date | null;
}
