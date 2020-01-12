import { BaseException } from '../../command/exceptions/base.exception';

export class WrongParamsException extends BaseException {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
