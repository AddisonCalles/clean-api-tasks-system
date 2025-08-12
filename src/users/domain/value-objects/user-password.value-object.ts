import { ValueObject } from '@shared/domain/value-objects/value-object';
import { UserPasswordInvalidException } from '../exceptions/user-password-invalid.exception';

export class UserPassword extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.length === 0) {
      throw new UserPasswordInvalidException('User password cannot be empty');
    }

    if (value.length < 8) {
      throw new UserPasswordInvalidException(
        'User password must be at least 8 characters long',
      );
    }

    if (value.length > 255) {
      throw new UserPasswordInvalidException(
        'User password cannot exceed 255 characters',
      );
    }
  }

  public toString(): string {
    return this.value;
  }
}
