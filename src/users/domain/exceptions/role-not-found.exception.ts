import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

export class RoleNotFoundException extends EntityNotFoundException {
  constructor(roleId: string) {
    super(`Role with ID ${roleId} not found`);
  }
}
