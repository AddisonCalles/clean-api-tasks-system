import { Permission } from '@users/domain/entities';
import { PermissionId, PermissionName } from '@users/domain/value-objects';

export interface PermissionRepository {
  create(permission: Permission): Promise<void>;
  findById(id: PermissionId): Promise<Permission | null>;
  findByName(name: PermissionName): Promise<Permission | null>;
  update(permission: Permission): Promise<void>;
  delete(id: PermissionId): Promise<void>;
  list(): Promise<Permission[]>;
}
