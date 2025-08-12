import { Permission, RolePermission } from '@users/domain/entities';
import { RoleId, PermissionId } from '@users/domain/value-objects';

export interface RolePermissionRepository {
  create(rolePermission: RolePermission): Promise<void>;
  delete(roleId: RoleId, permissionId: PermissionId): Promise<void>;
  findByRoleId(roleId: RoleId): Promise<Permission[]>;
  findByPermissionId(permissionId: PermissionId): Promise<RolePermission[]>;
  exists(roleId: RoleId, permissionId: PermissionId): Promise<boolean>;
}
