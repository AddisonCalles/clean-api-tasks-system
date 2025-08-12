import {
  CreateUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  CreateRoleUseCase,
  ListRolesUseCase,
  AssignRolePermissionsUseCase,
} from '@users/application/use-cases';
import {
  USER_REPOSITORY_PROVIDER,
  ROLE_REPOSITORY_PROVIDER,
  PERMISSION_REPOSITORY_PROVIDER,
  ROLE_PERMISSION_REPOSITORY_PROVIDER,
} from './user-repository.providers';
import { UserRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/user.typeorm.repository';
import { RoleRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role.typeorm.repository';
import { PermissionRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/permission.typeorm.repository';
import { RolePermissionRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role-permission.typeorm.repository';
import { PasswordHashBcryptAdapter } from '@users/infrastructure/adapters/password-hash-bcrypt.adapter';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';

export const CREATE_USER_USECASE = 'CREATE_USER_USECASE';
export const GET_USER_USECASE = 'GET_USER_USECASE';
export const LIST_USERS_USECASE = 'LIST_USERS_USECASE';
export const UPDATE_USER_USECASE = 'UPDATE_USER_USECASE';
export const DELETE_USER_USECASE = 'DELETE_USER_USECASE';
export const CREATE_ROLE_USECASE = 'CREATE_ROLE_USECASE';
export const LIST_ROLES_USECASE = 'LIST_ROLES_USECASE';
export const ASSIGN_ROLE_PERMISSIONS_USECASE =
  'ASSIGN_ROLE_PERMISSIONS_USECASE';
export const INITIALIZE_DEFAULT_ROLES_USECASE =
  'INITIALIZE_DEFAULT_ROLES_USECASE';
export const PASSWORD_HASH_PORT = 'PASSWORD_HASH_PORT';

export const passwordHashPortProvider = {
  provide: PASSWORD_HASH_PORT,
  useFactory: () => new PasswordHashBcryptAdapter(),
};

export const createUserUseCaseProvider = {
  provide: CREATE_USER_USECASE,
  useFactory: (
    userRepository: UserRepositoryTypeorm,
    roleRepository: RoleRepositoryTypeorm,
    passwordHash: PasswordHashPort,
  ) => {
    return new CreateUserUseCase(userRepository, roleRepository, passwordHash);
  },
  inject: [
    USER_REPOSITORY_PROVIDER,
    ROLE_REPOSITORY_PROVIDER,
    PASSWORD_HASH_PORT,
  ],
};

export const getUserUseCaseProvider = {
  provide: LIST_USERS_USECASE,
  useFactory: (
    userRepository: UserRepositoryTypeorm,
    roleRepository: RoleRepositoryTypeorm,
  ) => {
    return new ListUsersUseCase(userRepository, roleRepository);
  },
  inject: [USER_REPOSITORY_PROVIDER, ROLE_REPOSITORY_PROVIDER],
};

export const listUsersUseCaseProvider = {
  provide: GET_USER_USECASE,
  useFactory: (
    userRepository: UserRepositoryTypeorm,
    roleRepository: RoleRepositoryTypeorm,
  ) => {
    return new GetUserUseCase(userRepository, roleRepository);
  },
  inject: [USER_REPOSITORY_PROVIDER, ROLE_REPOSITORY_PROVIDER],
};

export const updateUserUseCaseProvider = {
  provide: UPDATE_USER_USECASE,
  useFactory: (
    userRepository: UserRepositoryTypeorm,
    roleRepository: RoleRepositoryTypeorm,
    passwordHash: PasswordHashPort,
  ) => {
    return new UpdateUserUseCase(userRepository, roleRepository, passwordHash);
  },
  inject: [
    USER_REPOSITORY_PROVIDER,
    ROLE_REPOSITORY_PROVIDER,
    PASSWORD_HASH_PORT,
  ],
};

export const deleteUserUseCaseProvider = {
  provide: DELETE_USER_USECASE,
  useFactory: (userRepository: UserRepositoryTypeorm) => {
    return new DeleteUserUseCase(userRepository);
  },
  inject: [USER_REPOSITORY_PROVIDER],
};

export const createRoleUseCaseProvider = {
  provide: CREATE_ROLE_USECASE,
  useFactory: (roleRepository: RoleRepositoryTypeorm) => {
    return new CreateRoleUseCase(roleRepository);
  },
  inject: [ROLE_REPOSITORY_PROVIDER],
};

export const listRolesUseCaseProvider = {
  provide: LIST_ROLES_USECASE,
  useFactory: (
    roleRepository: RoleRepositoryTypeorm,
    rolePermissionRepository: RolePermissionRepositoryTypeorm,
    permissionRepository: PermissionRepositoryTypeorm,
  ) => {
    return new ListRolesUseCase(
      roleRepository,
      rolePermissionRepository,
      permissionRepository,
    );
  },
  inject: [
    ROLE_REPOSITORY_PROVIDER,
    ROLE_PERMISSION_REPOSITORY_PROVIDER,
    PERMISSION_REPOSITORY_PROVIDER,
  ],
};

export const assignRolePermissionsUseCaseProvider = {
  provide: ASSIGN_ROLE_PERMISSIONS_USECASE,
  useFactory: (
    roleRepository: RoleRepositoryTypeorm,
    permissionRepository: PermissionRepositoryTypeorm,
    rolePermissionRepository: RolePermissionRepositoryTypeorm,
  ) => {
    return new AssignRolePermissionsUseCase(
      roleRepository,
      permissionRepository,
      rolePermissionRepository,
    );
  },
  inject: [
    ROLE_REPOSITORY_PROVIDER,
    PERMISSION_REPOSITORY_PROVIDER,
    ROLE_PERMISSION_REPOSITORY_PROVIDER,
  ],
};