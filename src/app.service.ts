import { Injectable } from '@nestjs/common';
import { AppConfig } from './config/app.config';

@Injectable()
export class AppService {
  constructor(private readonly appConfig: AppConfig) {}

  getHello(): string {
    console.log(this.appConfig.dbName);
    return 'Hello World!';
  }
}
