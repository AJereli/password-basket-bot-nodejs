import {Expose} from 'class-transformer';

export class AddCredentialsCommand {
  @Expose({ name: 't' })
  public title: string;

  @Expose({ name: 'l' })
  public login: string;

  @Expose({ name: 'p' })
  public password: string;

  @Expose({ name: 'b' })
  public basket: string;
}
