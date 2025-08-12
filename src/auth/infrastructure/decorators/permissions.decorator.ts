import { SetMetadata } from '@nestjs/common';
import { PermissionNameEnum } from '@users/domain/value-objects/permission-name.value-object';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: PermissionNameEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// Decoradores específicos para operaciones comunes
export const RequireCreateTask = () =>
  RequirePermissions(PermissionNameEnum.CREATE_TASK);

export const RequireEditTask = () =>
  RequirePermissions(PermissionNameEnum.EDIT_TASK);

export const RequireDeleteTask = () =>
  RequirePermissions(PermissionNameEnum.DELETE_TASK);

export const RequireViewAllTasks = () =>
  RequirePermissions(PermissionNameEnum.VIEW_ALL_TASKS);

export const RequireAssignUsersTask = () =>
  RequirePermissions(PermissionNameEnum.ASSIGN_USERS_TASK);

export const RequireCreateUser = () =>
  RequirePermissions(PermissionNameEnum.CREATE_USER);

export const RequireEditUser = () =>
  RequirePermissions(PermissionNameEnum.EDIT_USER);

export const RequireDeleteUser = () =>
  RequirePermissions(PermissionNameEnum.DELETE_USER);

export const RequireViewUser = () =>
  RequirePermissions(PermissionNameEnum.VIEW_USER);

export const RequireViewAllUsers = () =>
  RequirePermissions(PermissionNameEnum.VIEW_ALL_USERS);

export const RequireManageUsers = () =>
  RequirePermissions(PermissionNameEnum.MANAGE_USERS);

export const RequireManageRoles = () =>
  RequirePermissions(PermissionNameEnum.MANAGE_ROLES);

export const RequireManagePermissions = () =>
  RequirePermissions(PermissionNameEnum.MANAGE_PERMISSIONS);

export const RequireAccessAnalytics = () =>
  RequirePermissions(PermissionNameEnum.ACCESS_ANALYTICS);
