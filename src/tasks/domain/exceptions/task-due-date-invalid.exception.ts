import { ValidationException } from '@shared/domain/exceptions';

export class TaskDueDateInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
