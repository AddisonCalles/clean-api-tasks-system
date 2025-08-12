import { ValidationException } from '@shared/domain/exceptions/validation.exception';

export class UserPasswordInvalidException extends ValidationException {
  constructor(email: string) {
    super(`Invalid password for user with email: ${email}`);
  }
}
