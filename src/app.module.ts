import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from 'nestjs-env';
import { AppConfig } from './config/app.config';
// import { createConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity';
import { CredentialsEntity } from './entites/credentials.entity';
import { BasketEntity } from './entites/basket.entity';
import { TelegramBotService } from './telegram.bot/telegram.bot.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CommandService } from './command/command.service';
import { BasketModule } from './backet/basket.module';
import { BasketService } from './backet/basket.service';
import { UserBasketEntity } from './entites/user.basket.entity';
import { BasketPermissionEntity } from './entites/basket.permission.entity';
import { MessageRecordEntity } from './entites/message.record.entity';

@Module({
  imports: [
    EnvModule.register([AppConfig]),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        logging: true,
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        entities: [
          UserEntity, CredentialsEntity, BasketEntity, UserBasketEntity, BasketPermissionEntity,
          MessageRecordEntity,
        ],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([MessageRecordEntity]),
    UserModule,
    CredentialsModule,
    BasketModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramBotService, CommandService],
})
export class AppModule {}
