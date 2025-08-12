import { ValueObject } from '@shared/domain/value-objects/value-object';
import { UserNameInvalidException } from '../exceptions/user-name-invalid.exception';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    const normalizedValue = value?.trim();
    super(normalizedValue);
    this.ensureValidFormat(normalizedValue);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new UserNameInvalidException('User name cannot be empty');
    }

    if (value.trim().length < 2) {
      throw new UserNameInvalidException(
        'User name must be at least 2 characters long',
      );
    }

    if (value.trim().length > 100) {
      throw new UserNameInvalidException(
        'User name cannot exceed 100 characters',
      );
    }
  }

  public toString(): string {
    return this.value;
  }
}
