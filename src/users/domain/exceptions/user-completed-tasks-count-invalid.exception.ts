import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserCompletedTasksCountInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
