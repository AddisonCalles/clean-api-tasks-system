import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class TaskDescriptionInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
