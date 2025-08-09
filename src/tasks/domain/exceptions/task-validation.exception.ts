import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class TaskValidationException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
