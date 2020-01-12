import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CredentialsEntity } from './credentials.entity';
import { UserBasketEntity } from './user.basket.entity';

@Entity('basket')
export class BasketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  title: string;

  @Column({nullable: true})
  description: string;

  @OneToMany(type => UserBasketEntity, userBasket => userBasket.user)
  @JoinColumn({name: 'basket_id'})
  userBasket: UserBasketEntity[];

  @OneToMany(type => CredentialsEntity, cred => cred.basket)
  credentials: CredentialsEntity[];

  @CreateDateColumn({name: 'created_date'})
  createDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updateDate: Date;
}
