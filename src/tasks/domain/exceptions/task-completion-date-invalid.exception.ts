import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class TaskCompletionDateInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
