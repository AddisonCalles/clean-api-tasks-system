import { SetMetadata } from '@nestjs/common';
import { PermissionNameEnum } from '@users/domain/value-objects/permission-name.value-object';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: PermissionNameEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
