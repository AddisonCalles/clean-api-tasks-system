import { ValueObject } from '@shared/domain/value-objects/value-object';
import { RoleDescriptionInvalidException } from '../exceptions/role-description-invalid.exception';

export class RoleDescription extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (value && value.length > 500) {
      throw new RoleDescriptionInvalidException(
        'Role description cannot exceed 500 characters',
      );
    }
  }

  public toString(): string {
    return this.value || '';
  }
}
