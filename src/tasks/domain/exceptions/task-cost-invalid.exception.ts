import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class TaskCostInvalidException extends ValidationException {
  constructor(message: string) {
    super(message);
  }
}
