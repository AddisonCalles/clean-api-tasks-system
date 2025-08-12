import { BaseIdValueObject, type EntityID } from '@shared/domain/value-objects';

export class RoleId extends BaseIdValueObject {
  constructor(value: EntityID) {
    super(value, 'Role ID');
  }

  public static generate(): RoleId {
    return new RoleId(BaseIdValueObject.generateEntityID());
  }
}
