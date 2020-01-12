import { Expose } from 'class-transformer';

export class ShareBasketCommand {
  @Expose({ name: 't' })
  public title: string;

  @Expose({ name: 'u' })
  public username: string;
}
