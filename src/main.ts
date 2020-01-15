import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {config} from 'dotenv';
config();
console.log(process.env.CRYPTO_ALG);
console.log(process.env.CRYPTO_L_PASS);
console.log(process.env.CRYPTO_P_PASS);

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NODE_PORT);
}

bootstrap();
