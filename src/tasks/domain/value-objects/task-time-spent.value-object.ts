import { ValueObject } from '@shared/domain/value-objects/value-object';

export class TaskTimeSpent extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: number): void {
    if (value < 0) {
      throw new Error('Time spent cannot be negative');
    }

    if (value > 10000) {
      throw new Error('Time spent cannot exceed 10000 hours');
    }
  }

  public add(hours: number): TaskTimeSpent {
    return new TaskTimeSpent(this.value + hours);
  }

  public reset(): TaskTimeSpent {
    return new TaskTimeSpent(0);
  }

  public toString(): string {
    return this.value.toString();
  }
}
