import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserFilterInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
