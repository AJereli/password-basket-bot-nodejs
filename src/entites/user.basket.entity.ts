import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BasketEntity } from './basket.entity';
import { BasketPermissionEnum, BasketPermissionEntity } from './basket.permission.entity';

@Entity('user_basket')
export class UserBasketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToOne(type => BasketPermissionEntity)
  @JoinColumn({name: 'permission'})
  permission: BasketPermissionEntity;

  @Column({name: 'user_id'})
  userId: number;

  @Column({name: 'basket_id'})
  basketId: number;

  @ManyToOne(type => UserEntity, user => user.userBasket, {
    cascade: ['insert', 'update'],
    primary: true })
  @JoinColumn({name: 'user_id'})
  user: UserEntity;

  @ManyToOne(type => BasketEntity, basket => basket.userBasket, {
    cascade: ['insert', 'update'],
    primary: true })
  @JoinColumn({name: 'basket_id'})
  basket: BasketEntity;
}
