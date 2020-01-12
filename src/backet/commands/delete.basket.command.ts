import { Expose } from 'class-transformer';

export class DeleteBasketCommand {
  @Expose({ name: 't' })
  public title: string;
}
