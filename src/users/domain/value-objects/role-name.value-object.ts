import { ValueObject } from '@shared/domain/value-objects/value-object';
import { RoleNameInvalidException } from '../exceptions/role-name-invalid.exception';

export enum RoleNameEnum {
  ADMINISTRATOR = 'administrator',
  MEMBER = 'member',
}

export class RoleName extends ValueObject<string> {
  private static readonly VALID_ROLES = [
    RoleNameEnum.ADMINISTRATOR,
    RoleNameEnum.MEMBER,
  ];

  constructor(value: string) {
    const normalizedValue = value?.toLowerCase().trim();
    super(normalizedValue);
    this.ensureValidFormat(normalizedValue);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new RoleNameInvalidException('Role name cannot be empty');
    }

    if (!RoleName.VALID_ROLES.includes(value.toLowerCase() as RoleNameEnum)) {
      throw new RoleNameInvalidException(
        `Role name invalid: ${value}. Role name must be one of: ${RoleName.VALID_ROLES.join(', ')}`,
      );
    }
  }

  public static admin(): RoleName {
    return new RoleName(RoleNameEnum.ADMINISTRATOR);
  }

  public static member(): RoleName {
    return new RoleName(RoleNameEnum.MEMBER);
  }

  public isAdmin(): boolean {
    return this.value.toLowerCase() === RoleNameEnum.ADMINISTRATOR.toString();
  }

  public isMember(): boolean {
    return this.value.toLowerCase() === RoleNameEnum.MEMBER.toString();
  }

  public toString(): string {
    return this.value;
  }
}
