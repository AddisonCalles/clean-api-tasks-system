import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class AuthorizationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationException';
  }
}

export class InsufficientPermissionsException extends AuthorizationException {
  constructor(requiredPermissions: string[], userPermissions: string[]) {
    super(
      `Insufficient permissions. Required: [${requiredPermissions.join(', ')}], User has: [${userPermissions.join(', ')}]`,
    );
    this.name = 'InsufficientPermissionsException';
  }
}

export class InvalidAuthorizationContextException extends AuthorizationException {
  constructor(message: string) {
    super(`Invalid authorization context: ${message}`);
    this.name = 'InvalidAuthorizationContextException';
  }
}
