import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

export class UserNotFoundException extends EntityNotFoundException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}
