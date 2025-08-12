import { UserId } from '@users/domain/value-objects';
import { PermissionName } from '@users/domain/value-objects';

export interface AuthorizeUserRequest {
  userId: UserId;
  requiredPermissions: PermissionName[];
}
