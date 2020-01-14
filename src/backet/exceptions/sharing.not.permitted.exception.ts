import { BaseException } from '../../command/exceptions/base.exception';

export class SharingNotPermittedException extends BaseException{
  constructor() {
    super();
    this.message = 'You need to be the owner of basket to share it with other users';
  }
}
