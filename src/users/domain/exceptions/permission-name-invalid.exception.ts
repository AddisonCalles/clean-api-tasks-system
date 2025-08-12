import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class PermissionNameInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
