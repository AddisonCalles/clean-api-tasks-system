import { BaseIdValueObject, type EntityID } from '@shared/domain/value-objects';

export class UserId extends BaseIdValueObject {
  constructor(value: EntityID) {
    super(value, 'User ID');
  }

  public static generate(): UserId {
    return new UserId(BaseIdValueObject.generateEntityID());
  }
}
