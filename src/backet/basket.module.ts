import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entites/user.entity';
import { AppController } from '../app.controller';
import { BasketEntity } from '../entites/basket.entity';
import { BasketService } from './basket.service';
import { UserBasketEntity } from '../entites/user.basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BasketEntity, UserBasketEntity])],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
