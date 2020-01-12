import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from '../entites/basket.entity';
import { CredentialsService } from './credentials.service';
import { CredentialsEntity } from '../entites/credentials.entity';
import { UserBasketEntity } from '../entites/user.basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialsEntity, BasketEntity, UserBasketEntity])],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
