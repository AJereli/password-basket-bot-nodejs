import { AfterLoad, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BasketEntity } from './basket.entity';
import * as crypto from 'crypto';

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

  @AfterLoad()
  async decryptCredentials() {
    const iv = Buffer.alloc(16, 0);

    const keyLogin = crypto.scryptSync(process.env.CRYPTO_L_PASS, 'salt', 32);
    const keyPass = crypto.scryptSync(process.env.CRYPTO_P_PASS, 'salt', 32);

    const decipherLogin = crypto.createDecipheriv(process.env.CRYPTO_ALG, keyLogin, iv);
    let loginDecrypted = decipherLogin.update(this.login, 'hex', 'utf8');
    loginDecrypted += decipherLogin.final('utf8');

    const decipherPass = crypto.createDecipheriv(process.env.CRYPTO_ALG, keyPass, iv);
    let passDecrypted = decipherPass.update(this.password, 'hex', 'utf8');
    passDecrypted += decipherPass.final('utf8');

    this.password = passDecrypted;
    this.login = loginDecrypted;
  }

  @BeforeInsert()
  encryptCredentials() {
    const iv = Buffer.alloc(16, 0);
    const keyLogin = crypto.scryptSync(process.env.CRYPTO_L_PASS, 'salt', 32);
    const keyPass = crypto.scryptSync(process.env.CRYPTO_P_PASS, 'salt', 32);

    const cipherLogin = crypto.createCipheriv(process.env.CRYPTO_ALG, keyLogin, iv);
    let loginEncrypted = cipherLogin.update(this.login, 'utf8', 'hex');
    loginEncrypted += cipherLogin.final('hex');

    const cipherPass = crypto.createCipheriv(process.env.CRYPTO_ALG, keyPass, iv);
    let passEncrypted = cipherPass.update(this.password, 'utf8', 'hex');
    passEncrypted += cipherPass.final('hex');

    this.password = passEncrypted;
    this.login = loginEncrypted;
  }

  public toResponseString(basket?: string): string {
    return `Title: ${this.title}\nLogin: ${this.login}\nPassword: ${this.password}\n\nFrom Basket: ${this.basket?.title || basket}`;
  }
}
