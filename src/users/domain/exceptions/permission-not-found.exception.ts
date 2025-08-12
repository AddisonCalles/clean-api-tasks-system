import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

export class PermissionNotFoundException extends EntityNotFoundException {
  constructor(permissionId: string) {
    super(`Permission with ID ${permissionId} not found`);
  }
}
