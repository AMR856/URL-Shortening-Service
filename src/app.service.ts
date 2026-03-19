import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to URL Shortener API v2.0 (NestJS)';
  }
}
