import { RoleId, PermissionId } from '@users/domain/value-objects';

export class RolePermission {
  constructor(
    private readonly _roleId: RoleId,
    private readonly _permissionId: PermissionId,
    private readonly _createdAt: Date,
  ) {}

  // Getters
  get roleId(): RoleId {
    return this._roleId;
  }

  get permissionId(): PermissionId {
    return this._permissionId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Factory method
  public static create(
    roleId: RoleId,
    permissionId: PermissionId,
  ): RolePermission {
    return new RolePermission(roleId, permissionId, new Date());
  }

  // Reconstitution method
  public static reconstitute(
    roleId: RoleId,
    permissionId: PermissionId,
    createdAt: Date,
  ): RolePermission {
    return new RolePermission(roleId, permissionId, createdAt);
  }
}
