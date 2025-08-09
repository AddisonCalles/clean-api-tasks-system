import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class TaskAssignedUsersInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
