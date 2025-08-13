import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticateUserUseCase } from '@auth/application/use-cases';
import { RoleRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role.typeorm.repository';
import { RolePermissionRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role-permission.typeorm.repository';
import { PasswordHashBcryptAdapter } from '@users/infrastructure/adapters/password-hash-bcrypt.adapter';
import { SessionJwtManagerAdapter } from '@auth/infrastructure/adapters/session-jwt-manager.adapter';
import {
  PASSWORD_HASH_PORT,
  ROLE_PERMISSION_REPOSITORY_PROVIDER,
  ROLE_REPOSITORY_PROVIDER,
  USER_REPOSITORY_PROVIDER,
} from '@users/infrastructure/providers';
import {
  RolePermissionRepository,
  UserRepository,
} from '@users/domain/repositories';
import { AuthorizeUserUseCase } from '@auth/application/use-cases/authorize-user.use-case';

export const AUTHENTICATE_USER_USECASE = 'AUTHENTICATE_USER_USECASE';
export const AUTHORIZE_USER_USECASE = 'AUTHORIZE_USER_USECASE';

export const SESSION_MANAGER_PORT = 'SESSION_MANAGER_PORT';

export const authenticateUserUseCaseProvider: Provider = {
  provide: AUTHENTICATE_USER_USECASE,
  useFactory: (
    userRepository: UserRepository,
    roleRepository: RoleRepositoryTypeorm,
    rolePermissionRepository: RolePermissionRepositoryTypeorm,
    passwordHash: PasswordHashBcryptAdapter,
    sessionManager: SessionJwtManagerAdapter,
  ) => {
    return new AuthenticateUserUseCase(
      userRepository,
      roleRepository,
      rolePermissionRepository,
      passwordHash,
      sessionManager,
    );
  },
  inject: [
    USER_REPOSITORY_PROVIDER,
    ROLE_REPOSITORY_PROVIDER,
    ROLE_PERMISSION_REPOSITORY_PROVIDER,
    PASSWORD_HASH_PORT,
    SESSION_MANAGER_PORT,
  ],
};

export const authorizeUserUseCaseProvider: Provider = {
  provide: AUTHORIZE_USER_USECASE,
  useFactory: (
    userPermissionRepository: RolePermissionRepository,
    userRepository: UserRepository,
  ) => {
    return new AuthorizeUserUseCase(userPermissionRepository, userRepository);
  },
  inject: [ROLE_PERMISSION_REPOSITORY_PROVIDER, USER_REPOSITORY_PROVIDER],
};

export const sessionManagerProvider: Provider = {
  provide: SESSION_MANAGER_PORT,
  useFactory: (jwtService: JwtService) => {
    return new SessionJwtManagerAdapter(jwtService);
  },
  inject: [JwtService],
};
