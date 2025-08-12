import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class RoleDescriptionInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
