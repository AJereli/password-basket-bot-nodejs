import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entites/user.entity';
import { AppController } from '../app.controller';
import { UserService } from './user.service';
import { BasketEntity } from '../entites/basket.entity';
import { UserBasketEntity } from '../entites/user.basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBasketEntity, UserEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
