import { RequirePermissions } from '@auth/infrastructure/decorators/permissions.decorator';
import { PermissionNameEnum } from '@users/domain/value-objects';
export const RequiredCreateTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.CREATE_TASK);

export const RequiredUpdateTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.EDIT_TASK);

export const RequiredDeleteTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.DELETE_TASK);

export const RequiredAssignUsersTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.ASSIGN_USERS_TASK);

export const RequiredViewTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.VIEW_TASK);

export const RequiredViewAllTasksPermissions = () =>
  RequirePermissions(PermissionNameEnum.VIEW_ALL_TASKS);

export const RequiredCompleteTaskPermissions = () =>
  RequirePermissions(PermissionNameEnum.EDIT_TASK);
