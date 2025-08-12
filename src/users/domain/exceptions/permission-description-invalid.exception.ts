import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class PermissionDescriptionInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
