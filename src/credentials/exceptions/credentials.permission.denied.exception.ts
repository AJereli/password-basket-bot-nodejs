import { BaseException } from '../../command/exceptions/base.exception';

export class CredentialsPermissionDeniedException extends BaseException {
  constructor() {
    super();

    this.message = 'You have not write permission to create record in this basket';
  }
}
