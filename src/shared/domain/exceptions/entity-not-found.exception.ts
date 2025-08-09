import { DomainException } from './domain.exception';

export class EntityNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
