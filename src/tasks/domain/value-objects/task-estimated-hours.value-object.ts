import { ValueObject } from '@shared/domain/value-objects/value-object';

export class TaskEstimatedHours extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: number): void {
    if (value < 0) {
      throw new Error('Estimated hours cannot be negative');
    }

    if (value > 1000) {
      throw new Error('Estimated hours cannot exceed 1000 hours');
    }
  }

  public add(hours: number): TaskEstimatedHours {
    return new TaskEstimatedHours(this.value + hours);
  }

  public subtract(hours: number): TaskEstimatedHours {
    return new TaskEstimatedHours(Math.max(0, this.value - hours));
  }

  public toString(): string {
    return this.value.toString();
  }
}
