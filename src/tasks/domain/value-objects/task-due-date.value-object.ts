import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskDueDateInvalidException } from '../exceptions/task-due-date-invalid.exception';

export class TaskDueDate extends ValueObject<Date> {
  constructor(value: Date | string) {
    if (typeof value === 'string') {
      value = new Date(value);
    }
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: Date): void {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TaskDueDateInvalidException('Due date must be a valid date');
    }
  }

  public isOverdue(): boolean {
    const today = new Date();
    return this.value < today;
  }

  public getDaysUntilDue(): number {
    const today = new Date();
    const timeDiff = this.value.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  public toString(): string {
    return this.value.toISOString();
  }
}
