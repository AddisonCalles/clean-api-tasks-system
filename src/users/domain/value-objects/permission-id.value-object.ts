import { BaseIdValueObject, type EntityID } from '@shared/domain/value-objects';

export class PermissionId extends BaseIdValueObject {
  constructor(value: EntityID) {
    super(value, 'Permission ID');
  }

  public static generate(): PermissionId {
    return new PermissionId(BaseIdValueObject.generateEntityID());
  }
}
