import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskCompletionDateInvalidException } from '@tasks/domain/exceptions';

export class TaskCompletionDate extends ValueObject<Date> {
  constructor(value: Date) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: Date): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TaskCompletionDateInvalidException(
        'Completion date must be a valid date',
      );
    }

    const now = new Date();
    if (value > now) {
      throw new TaskCompletionDateInvalidException(
        'Completion date cannot be in the future',
      );
    }
  }

  public toString(): string {
    return this.value.toISOString();
  }
}
