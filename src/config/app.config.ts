import { Env, EnvType } from 'nestjs-env';
import { Injectable } from '@nestjs/common';

// @Injectable()
export class AppConfig {
  @Env('DB_NAME')
  dbName: string;

  @Env('DB_HOST')
  dbHost: string;

  @Env('DB_USER')
  dbUser: string;

  @Env('DB_PASS')
  dbPass: string;

  @Env('DB_PORT')
  dbPort: number;

  @Env('TG_BOT_TOKEN')
  tgBotToken: string;
}
