import { Expose } from 'class-transformer';

export class DeleteCredentialsCommand {
  @Expose({ name: 't' })
  public title: string;

  @Expose({ name: 'b' })
  public basket: string;
}
