import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {config} from 'dotenv';
config();

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NODE_PORT);
}

bootstrap();
