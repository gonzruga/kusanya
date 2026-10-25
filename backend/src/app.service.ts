import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is the KUSANYA project backend service running through NestJS on http://localhost:3000';
  }
}
