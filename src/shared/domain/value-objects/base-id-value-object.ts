import { ValueObject } from '@shared/domain/value-objects/value-object';

export class TaskId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Task ID cannot be empty');
    }
  }

  public static generate(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  public toString(): string {
    return this.value;
  }
}
