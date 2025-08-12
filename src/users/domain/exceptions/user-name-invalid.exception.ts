import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserNameInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
