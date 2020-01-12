import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialsEntity } from '../entites/credentials.entity';
import { Repository } from 'typeorm';
import { BasketEntity } from '../entites/basket.entity';
import { AddCredentialsCommand } from './commands/add.credentials.command';
import { UserEntity } from '../entites/user.entity';
import { WrongParamsException } from '../backet/exceptions/wrong.params.exception';
import { ShowCredentialsCommand } from './commands/show.credentials.command';
import { CredentialsNotFoundException } from './exceptions/credentials.not.found.exception';
import { DeleteCredentialsCommand } from './commands/delete.credentials.command';
import { UserBasketEntity } from '../entites/user.basket.entity';
import { BasketPermissionEnum } from '../entites/basket.permission.entity';
import { CredentialsPermissionDeniedException } from './exceptions/credentials.permission.denied.exception';

@Injectable()
export class CredentialsService {

  constructor(@InjectRepository(CredentialsEntity) private readonly credentialsRepository: Repository<CredentialsEntity>,
              @InjectRepository(BasketEntity) private readonly basketRepository: Repository<BasketEntity>,
              @InjectRepository(UserBasketEntity) private readonly userBasketRepository: Repository<UserBasketEntity>) {}

  async create(credentials: AddCredentialsCommand,
               user: UserEntity): Promise<CredentialsEntity> {
    if (!credentials.login ||
        !credentials.password ||
        !credentials.title) {
      throw new WrongParamsException('Wrong params for this command');
    }

    const credentialsEntity = new CredentialsEntity();
    credentialsEntity.login = credentials.login;
    credentialsEntity.title = credentials.title;
    credentialsEntity.password = credentials.password;

    const basketTitle = credentials.basket || 'default';

    const userBasketEntity = await this.userBasketRepository
      .createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'user', 'user.id = :uid', {uid: user.id})
      .leftJoinAndSelect('ub.basket', 'basket', 'basket.id = ub.basket_id')
      .leftJoinAndSelect('ub.permission', 'permission')
      .leftJoinAndSelect('basket.credentials' , 'c', 'c.basket_id = basket.id')
      .where('basket.title = :title', {
        title: basketTitle,
      })
      .getOne();

    if (!userBasketEntity) {
      throw new WrongParamsException('Basket not found');
    }

    if (userBasketEntity.permission.permission !== BasketPermissionEnum.write) {
      throw new CredentialsPermissionDeniedException();
    }

    if (userBasketEntity.basket.credentials.some(c => c.title === credentials.title)) {
      throw new WrongParamsException('The credentials with this title already in this basket');
    }

    credentialsEntity.basket = userBasketEntity.basket;

    return this.credentialsRepository.save(credentialsEntity);
  }

  async update(credentialsCommand: AddCredentialsCommand, user: UserEntity) {
    const basketTitle = credentialsCommand.basket || 'default';

    const userBasketEntity = await this.userBasketRepository.createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'u', 'u.id = :uid', {uid: user.id})
      .leftJoinAndSelect('ub.basket', 'b', 'b.id = ub.basket_id')
      .leftJoinAndSelect('ub.permission', 'p')
      .leftJoinAndSelect('b.credentials', 'c', 'c.basket_id = b.id')
      .where('b.title = :bTitle', {bTitle: basketTitle})
      .andWhere('c.title = :cTitle', {cTitle: credentialsCommand.title})
      .getOne();

    const currentPermission = userBasketEntity.permission;

    if (currentPermission.permission !== BasketPermissionEnum.write) {
      throw new CredentialsPermissionDeniedException();
    }

    const credentials = userBasketEntity.basket.credentials[0];

    if (!credentials) {
      throw new CredentialsNotFoundException();
    }

    credentials.password = credentialsCommand.password || credentials.password;
    credentials.login = credentialsCommand.login || credentials.login;

    return this.credentialsRepository.save(credentials);

  }

  async delete(deleteOptions: DeleteCredentialsCommand, user: UserEntity) {
    const basketTitle = deleteOptions.basket || 'default';

    if (!deleteOptions.title) {
      throw new WrongParamsException('Title is required');
    }

    const userBasket = await this.userBasketRepository.createQueryBuilder('ub')
      .leftJoin('ub.user', 'u', 'u.id = :uid', {uid: user.id})
      .leftJoinAndSelect('ub.basket', 'b', 'ub.basket_id = b.id')
      .leftJoinAndSelect('ub.permission', 'p')
      .leftJoinAndSelect('b.credentials', 'c', 'c.basket_id = b.id')
      .where('b.title = :bTitle', {bTitle: basketTitle})
      .andWhere('c.title = :cTitle', {cTitle: deleteOptions.title})
      .getOne();

    if (userBasket.permission.permission !== BasketPermissionEnum.write) {
      throw new CredentialsPermissionDeniedException();
    }
    const credentials = userBasket.basket.credentials[0];

    if (!credentials) {
      throw new CredentialsNotFoundException();
    }

    await this.credentialsRepository.remove(credentials);
  }

  async get(showOptions: ShowCredentialsCommand, user: UserEntity): Promise<CredentialsEntity[]> {
    if (showOptions.all) {
      const result = await this.credentialsRepository.find({
        relations: ['basket', 'basket.userBasket', 'basket.userBasket.user'],
        where: {
          user: {
            id: user.id,
          },
        },
      });

      return result;
    }

    const basketTitle = showOptions.basket || 'default';

    const credentials = await this.userBasketRepository.createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'u', 'u.id = ub.user_id')
      .leftJoinAndSelect('ub.basket', 'b', 'b.id = ub.basket_id')
      .leftJoinAndSelect('b.credentials', 'c', 'c.basket_id = b.id')
      .where('u.id = :uid', {uid: user.id})
      .andWhere('b.title = :bTitle', {bTitle: basketTitle})
      .getOne();

    return credentials.basket.credentials;

  }

}
