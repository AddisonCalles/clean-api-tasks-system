import { UserPassword, PasswordHash } from '@users/domain/value-objects';

export abstract class PasswordHashPort {
  abstract hash(password: UserPassword): Promise<PasswordHash>;
  abstract compare(
    password: UserPassword,
    hash: PasswordHash,
  ): Promise<boolean>;
}
