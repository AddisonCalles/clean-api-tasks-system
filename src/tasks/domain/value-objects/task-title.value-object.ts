import { ValidationException } from '@shared/domain/exceptions';
import { ValueObject } from '@shared/domain/value-objects/value-object';

export class TaskTitle extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationException('Task title cannot be empty');
    }

    if (value.trim().length < 3) {
      throw new ValidationException(
        'Task title must be at least 3 characters long',
      );
    }

    if (value.trim().length > 255) {
      throw new ValidationException('Task title cannot exceed 255 characters');
    }
  }

  public toString(): string {
    return this.value.trim();
  }
}
