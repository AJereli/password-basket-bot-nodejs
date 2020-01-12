import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BasketEntity } from './basket.entity';

@Entity('credentials')
export class CredentialsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  title: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @ManyToOne(type => BasketEntity, basket => basket.credentials)
  @JoinColumn({ name: 'basket_id' })
  basket: BasketEntity;

  @CreateDateColumn({name: 'created_date'})
  createDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
    updateDate: Date;

  public toResponseString(basket?: string): string {
    return `Title: ${this.title}\nLogin: ${this.login}\nPassword: ${this.password}\n\nFrom Basket: ${this.basket?.title || basket}`;
  }
}
