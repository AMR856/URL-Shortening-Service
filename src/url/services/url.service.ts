import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlDto } from '../dto/create-url.dto';
import { UpdateUrlDto } from '../dto/update-url.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { generateShortCode } from '../../common/utils/generate-short-code';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUrl(createUrlDto: CreateUrlDto) {
    const { url } = createUrlDto;

    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL format');
    }

    // Generate unique short code
    let shortCode = generateShortCode();
    let isUnique = false;

    while (!isUnique) {
      const existing = await this.prisma.urls.findUnique({
        where: { shortCode },
      });

      if (!existing) {
        isUnique = true;
      } else {
        shortCode = generateShortCode();
      }
    }

    // Create URL record
    const newUrl = await this.prisma.urls.create({
      data: {
        url,
        shortCode,
      },
    });

    return {
      id: newUrl.id,
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      clicks: newUrl.clicks,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    };
  }

  async getUrl(shortCode: string) {
    if (!shortCode || typeof shortCode !== 'string') {
      throw new BadRequestException('You must provide a short code.');
    }

    const urlRecord = await this.prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!urlRecord) {
      throw new NotFoundException('Short URL not found.');
    }

    // Increment click count
    const updatedRecord = await this.prisma.urls.update({
      where: { shortCode },
      data: {
        clicks: { increment: 1 },
      },
    });

    return {
      id: updatedRecord.id,
      url: updatedRecord.url,
      shortCode: updatedRecord.shortCode,
      clicks: updatedRecord.clicks,
    };
  }

  async updateUrl(shortCode: string, updateUrlDto: UpdateUrlDto) {
    const { url: newUrl } = updateUrlDto;

    if (!newUrl || typeof newUrl !== 'string') {
      throw new BadRequestException('The original URL should be provided');
    }

    // Validate URL format
    try {
      new URL(newUrl);
    } catch {
      throw new BadRequestException('Invalid new URL format.');
    }

    if (!shortCode || typeof shortCode !== 'string') {
      throw new BadRequestException('You should provide the current short URL');
    }

    // Check if URL exists
    const existingUrl = await this.prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!existingUrl) {
      throw new NotFoundException("Short URL wasn't found");
    }

    // Update URL
    const updated = await this.prisma.urls.update({
      where: { shortCode },
      data: { url: newUrl, updatedAt: new Date() },
    });

    return {
      id: updated.id,
      url: updated.url,
      shortCode: updated.shortCode,
      clicks: updated.clicks,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteUrl(shortCode: string) {
    if (!shortCode || typeof shortCode !== 'string') {
      throw new BadRequestException('You should provide a short code');
    }

    // Check if URL exists
    const url = await this.prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    // Delete URL
    await this.prisma.urls.delete({
      where: { shortCode },
    });

    return { message: 'URL deleted successfully' };
  }

  async getStats(shortCode: string) {
    if (!shortCode || typeof shortCode !== 'string') {
      throw new BadRequestException('You must provide a short code.');
    }

    const urlRecord = await this.prisma.urls.findUnique({
      where: { shortCode },
    });

    if (!urlRecord) {
      throw new NotFoundException('Short URL not found.');
    }

    return {
      id: urlRecord.id,
      url: urlRecord.url,
      shortCode: urlRecord.shortCode,
      clicks: urlRecord.clicks,
      createdAt: urlRecord.createdAt,
      updatedAt: urlRecord.updatedAt,
      expiresAt: urlRecord.expiresAt,
    };
  }
}
