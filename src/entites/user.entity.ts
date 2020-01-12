import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BasketEntity } from './basket.entity';
import { UserBasketEntity } from './user.basket.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: 'telegram_id', unique: true})
  telegramId: number;

  @OneToMany(type => UserBasketEntity, userBasket => userBasket.user)
  @JoinColumn({name: 'user_id'})
  userBasket: UserBasketEntity[];

  @CreateDateColumn({name: 'created_date'})
  createDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updateDate: Date;
}
