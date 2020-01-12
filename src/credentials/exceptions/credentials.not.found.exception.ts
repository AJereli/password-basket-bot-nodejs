import { BaseException } from '../../command/exceptions/base.exception';

export class CredentialsNotFoundException extends BaseException {
  constructor() {
    super();
    this.message = 'Not credentials with such title was find';
  }
}
