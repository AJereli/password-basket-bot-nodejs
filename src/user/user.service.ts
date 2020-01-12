import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from '../entites/basket.entity';
import { UserBasketEntity } from '../entites/user.basket.entity';
import { BasketPermissionEnum, BasketPermissionEntity } from '../entites/basket.permission.entity';

@Injectable()
export class UserService {

  constructor(@InjectRepository(UserBasketEntity) private readonly userBasketRepository: Repository<UserBasketEntity>,
              @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  public async createUserWithBasket(tgId: number, username: string) {

    const user = this.createUser(tgId, username);
    const basket = new BasketEntity();
    basket.title = 'default';
    basket.description = 'This is default password basket of your account';

    const permission = new BasketPermissionEntity();
    permission.permission = BasketPermissionEnum.write;

    const userBasket = new UserBasketEntity();
    userBasket.basket = basket;
    userBasket.user = user;
    userBasket.permission = permission;

    return this.userBasketRepository.save(userBasket);
  }

  public createUser(tgId: number, username: string) {
    const user = new UserEntity();
    user.name = username;
    user.telegramId = tgId;
    return user;
  }

  public async findUser(telegramId: number) {
    return await this.userRepository.findOne({telegramId});
  }

}
