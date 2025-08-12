import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserEmailInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
