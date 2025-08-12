import { UserId, PermissionName } from '@users/domain/value-objects';

export interface AuthorizeUserResponse {
  isAuthorized: boolean;
  userId: UserId;
  requiredPermissions: PermissionName[];
  userPermissions: PermissionName[];
  missingPermissions?: PermissionName[];
}
