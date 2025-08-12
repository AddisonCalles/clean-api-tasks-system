/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PasswordHashPort } from '@users/application/ports/password-hash.port';
import { UserPassword, PasswordHash } from '@users/domain/value-objects';
import * as bcrypt from 'bcrypt';

export class PasswordHashBcryptAdapter implements PasswordHashPort {
  constructor(private readonly saltRounds: number = 10) {}
  async hash(password: UserPassword): Promise<PasswordHash> {
    const hash = await bcrypt.hash(password.value, this.saltRounds);
    return new PasswordHash(hash);
  }

  compare(password: UserPassword, hash: PasswordHash): Promise<boolean> {
    return bcrypt.compare(password.value, hash.value);
  }
}
