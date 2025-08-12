import { ValueObject } from '@shared/domain/value-objects/value-object';
import { UserEmailInvalidException } from '../exceptions/user-email-invalid.exception';

export class UserEmail extends ValueObject<string> {
  constructor(value: string) {
    const normalizedValue = value?.toLowerCase().trim();
    super(normalizedValue);
    this.ensureValidFormat(normalizedValue);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new UserEmailInvalidException('User email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      throw new UserEmailInvalidException(
        'User email must be a valid email address',
      );
    }

    if (value.trim().length > 255) {
      throw new UserEmailInvalidException(
        'User email cannot exceed 255 characters',
      );
    }
  }

  public toString(): string {
    return this.value.toLowerCase();
  }
}
