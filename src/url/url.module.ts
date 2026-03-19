import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url.controller';
import { UrlService } from './services/url.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
