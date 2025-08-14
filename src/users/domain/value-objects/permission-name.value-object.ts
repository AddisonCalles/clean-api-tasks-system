import { ValueObject } from '@shared/domain/value-objects/value-object';
import { PermissionNameInvalidException } from '../exceptions/permission-name-invalid.exception';

export enum PermissionNameEnum {
  CREATE_TASK = 'create_task',
  EDIT_TASK = 'edit_task',
  DELETE_TASK = 'delete_task',
  ASSIGN_USERS_TASK = 'assign_users_task',
  VIEW_ALL_TASKS = 'view_all_tasks',
  VIEW_TASK = 'view_task',
  MANAGE_USERS = 'manage_users',
  ACCESS_ANALYTICS = 'access_analytics',
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',
  VIEW_USER = 'view_user',
  VIEW_ALL_USERS = 'view_all_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  MANAGE_ROLE_PERMISSIONS = 'manage_role_permissions',
  CREATE_ROLE = 'create_role',
  VIEW_ROLES = 'view_roles',
  VIEW_TASK_STATISTICS = 'view_task_statistics',
}
export class PermissionName extends ValueObject<string> {
  private static readonly VALID_PERMISSIONS = Object.values(
    PermissionNameEnum,
  ).map((a) => a.toString().toLowerCase());

  constructor(value: string) {
    const normalizedValue = value?.toLowerCase().trim();
    super(normalizedValue);
    this.ensureValidFormat(normalizedValue);
  }

  private ensureValidFormat(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new PermissionNameInvalidException(
        'Permission name cannot be empty',
      );
    }

    if (!PermissionName.VALID_PERMISSIONS.includes(value.toLowerCase())) {
      throw new PermissionNameInvalidException(
        `Permission name must be one of: ${PermissionName.VALID_PERMISSIONS.join(', ')}`,
      );
    }
  }

  public allow(permission: PermissionNameEnum): boolean {
    return this.value === permission.toString().toLowerCase();
  }

  public toString(): string {
    return this.value;
  }
}
