import { AuthorizationContext } from '@auth/domain/value-objects/authorization-context.value-object';
import { InsufficientPermissionsException } from '@auth/domain/exceptions/authorization.exception';
import type { AuthorizeUserRequest } from '@auth/application/inputs/authorize-user.request.dto';
import type { AuthorizeUserResponse } from '@auth/application/outputs/authorize-user.response.dto';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { UserNotFoundException } from '@users/domain/exceptions';
import { RolePermissionRepository } from '@users/domain/repositories';

export class AuthorizeUserUseCase {
  constructor(
    private readonly userPermissionRepository: RolePermissionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(
    request: AuthorizeUserRequest,
  ): Promise<AuthorizeUserResponse> {
    const userId = request.userId;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId.value);
    }

    // find user permissions
    const userPermissions = await this.userPermissionRepository.findByRoleId(
      user.roleId,
    );

    const context = new AuthorizationContext({
      userId,
      userPermissions: userPermissions.map((p) => p.name),
      requiredPermissions: request.requiredPermissions,
    });

    const isAuthorized = context.hasRequiredPermissions();

    if (!isAuthorized) {
      throw new InsufficientPermissionsException(
        request.requiredPermissions.map((p) => p.value),
        userPermissions.map((p) => p.name.value),
      );
    }

    return {
      isAuthorized: true,
      userId: request.userId,
      requiredPermissions: request.requiredPermissions,
      userPermissions: userPermissions.map((p) => p.name),
      missingPermissions: context.getMissingPermissions(),
    };
  }
}
