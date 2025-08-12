import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserCompletedTasksTotalCostInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
