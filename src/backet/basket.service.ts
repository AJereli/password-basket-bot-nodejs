import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from '../entites/basket.entity';
import { Repository } from 'typeorm';
import { AddBasketCommand } from './commands/add.basket.command';
import { WrongParamsException } from './exceptions/wrong.params.exception';
import { UserEntity } from '../entites/user.entity';
import { DeleteBasketCommand } from './commands/delete.basket.command';
import { UserBasketEntity } from '../entites/user.basket.entity';
import { BasketPermissionEnum, BasketPermissionEntity } from '../entites/basket.permission.entity';

@Injectable()
export class BasketService {
  constructor(@InjectRepository(BasketEntity) private readonly basketRepository: Repository<BasketEntity>,
              @InjectRepository(UserBasketEntity) private readonly userBasketRepository: Repository<UserBasketEntity>) {}

  public async create(basketCommand: AddBasketCommand, user: UserEntity) {
    if (!basketCommand.title) {
      throw new WrongParamsException('You send incorrect parameters');
    }

    const existsBasket = await this.userBasketRepository
      .createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'user', 'user.id = :uid', {uid: user.id})
      .leftJoinAndSelect('ub.basket', 'basket', 'basket.id = ub.basket_id')
      .where('basket.title = :title', {
          title: basketCommand.title,
      })
      .andWhere('ub.permission = :perm', {perm: 'write'})
      .getOne();

    if (existsBasket) {
      throw new WrongParamsException('You already have a basket with this name');
    }

    const basket = new BasketEntity();
    const userBasket = new UserBasketEntity();
    basket.title = basketCommand.title;
    basket.description = basketCommand.description;

    userBasket.user = user;
    userBasket.basket = basket;

    const permission = new BasketPermissionEntity();
    permission.permission = BasketPermissionEnum.write;
    userBasket.permission = permission;

    return this.userBasketRepository.save(userBasket);
  }

  public async delete(deleteCommand: DeleteBasketCommand, user: UserEntity) {
    if (!deleteCommand.title) {
      throw new WrongParamsException('Title is required for deletion');
    }

    if (deleteCommand.title === 'default') {
      throw new WrongParamsException('You can not delete default basket');
    }

    const basket = await this.userBasketRepository
      .createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'user', 'user.id = :uid', {uid: user.id})
      .leftJoinAndSelect('ub.basket', 'basket', 'basket.id = ub.basket_id')
      .where('basket.title = :title', {
        title: deleteCommand.title,
      })
      .andWhere('ub.permission = :perm', {perm: BasketPermissionEnum.write})
      .getOne();


    if (!basket) {
      throw new WrongParamsException('Basket with such name not found');
    }

    return this.basketRepository.remove(basket.basket);

  }


}
