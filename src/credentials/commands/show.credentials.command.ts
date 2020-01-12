import { Expose } from 'class-transformer';

export class ShowCredentialsCommand {
  @Expose({ name: 'b' })
  public basket: string;

  @Expose({ name: 'all' })
  public all: boolean;

}
