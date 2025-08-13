import { ValueObject } from '@shared/domain/value-objects/value-object';
import { ValidationException } from '@shared/domain/exceptions';

export type EntityID = `${string}-${string}-${string}-${string}-${string}`;

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class BaseIdValueObject extends ValueObject<EntityID> {
  private readonly _name: string;

  constructor(value: EntityID, name: string = 'Entity ID') {
    super(value);
    this._name = name;
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: EntityID): void {
    if (!value || String(value).length === 0) {
      throw new ValidationException(`${this._name} cannot be empty`);
    }
    if (!String(value).match(UUID_REGEX)) {
      throw new ValidationException(`${this._name} is not a valid UUID`);
    }
  }

  public static generateEntityID(): EntityID {
    return crypto.randomUUID();
  }

  public toString(): string {
    return this.value;
  }
}
