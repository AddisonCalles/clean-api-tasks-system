import { ValueObject } from '@shared/domain/value-objects/value-object';
import { UserId } from '@users/domain/value-objects/user-id.value-object';
import { PermissionName } from '@users/domain/value-objects/permission-name.value-object';

export class AuthorizationContext extends ValueObject<{
  userId: UserId;
  userPermissions: PermissionName[];
  requiredPermissions: PermissionName[];
}> {
  constructor(value: {
    userId: UserId;
    userPermissions: PermissionName[];
    requiredPermissions: PermissionName[];
  }) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: {
    userId: UserId;
    userPermissions: PermissionName[];
    requiredPermissions: PermissionName[];
  }): void {
    if (!value.userId) {
      throw new Error('User ID is required');
    }

    if (!Array.isArray(value.userPermissions)) {
      throw new Error('User permissions must be an array');
    }

    if (!Array.isArray(value.requiredPermissions)) {
      throw new Error('Required permissions must be an array');
    }

    if (value.requiredPermissions.length === 0) {
      throw new Error('At least one required permission is needed');
    }
  }

  public hasRequiredPermissions(): boolean {
    const userPermissionSet = new Set(
      this.value.userPermissions.map((p) => p.value),
    );
    return this.value.requiredPermissions.every((permission) =>
      userPermissionSet.has(permission.value),
    );
  }

  public getUserId(): UserId {
    return this.value.userId;
  }

  public getUserPermissions(): PermissionName[] {
    return this.value.userPermissions;
  }

  public getRequiredPermissions(): PermissionName[] {
    return this.value.requiredPermissions;
  }

  public getMissingPermissions(): PermissionName[] {
    const userPermissionSet = new Set(
      this.value.userPermissions.map((p) => p.value),
    );
    return this.value.requiredPermissions.filter(
      (permission) => !userPermissionSet.has(permission.value),
    );
  }
}
