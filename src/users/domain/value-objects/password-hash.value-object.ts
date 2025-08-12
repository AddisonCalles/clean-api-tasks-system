import { ValueObject } from '@shared/domain/value-objects/value-object';

export class PasswordHash extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
