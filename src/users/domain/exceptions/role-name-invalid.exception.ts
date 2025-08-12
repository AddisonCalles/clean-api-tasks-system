import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class RoleNameInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
