import { ValueObject } from '@shared/domain/value-objects/value-object';

export class UserId extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }

  public toString(): string {
    return this.value;
  }
}
