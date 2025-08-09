import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskDescriptionInvalidException } from '@tasks/domain/exceptions';
export class TaskDescription extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (value && value.trim().length > 1000) {
      throw new TaskDescriptionInvalidException(
        'Task description cannot exceed 1000 characters',
      );
    }
  }

  public toString(): string {
    return this.value ? this.value.trim() : '';
  }

  public isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }
}
