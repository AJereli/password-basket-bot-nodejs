import {Expose} from 'class-transformer';

export class AddBasketCommand {
  @Expose({ name: 't' })
  public title: string;

  @Expose({ name: 'd' })
  public description: string;

}
