import { PermissionNameEnum } from '@users/domain/value-objects/permission-name.value-object';
import { RequirePermissions } from '@auth/infrastructure/decorators/permissions.decorator';

export const RequiredListUsersPermissions = () =>
  RequirePermissions(PermissionNameEnum.VIEW_ALL_USERS);

export const RequiredCreateUserPermissions = () =>
  RequirePermissions(PermissionNameEnum.CREATE_USER);

export const RequiredEditUserPermissions = () =>
  RequirePermissions(PermissionNameEnum.EDIT_USER);

export const RequiredDeleteUserPermissions = () =>
  RequirePermissions(PermissionNameEnum.DELETE_USER);

export const RequiredViewUserPermissions = () =>
  RequirePermissions(PermissionNameEnum.VIEW_USER);
