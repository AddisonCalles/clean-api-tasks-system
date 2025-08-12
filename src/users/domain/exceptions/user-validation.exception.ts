import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserValidationException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
