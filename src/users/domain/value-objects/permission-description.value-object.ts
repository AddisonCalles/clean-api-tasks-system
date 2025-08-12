import { ValueObject } from '@shared/domain/value-objects/value-object';
import { PermissionDescriptionInvalidException } from '../exceptions/permission-description-invalid.exception';

export class PermissionDescription extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: string): void {
    if (value && value.length > 500) {
      throw new PermissionDescriptionInvalidException(
        'Permission description cannot exceed 500 characters',
      );
    }
  }

  public toString(): string {
    return this.value || '';
  }
}
