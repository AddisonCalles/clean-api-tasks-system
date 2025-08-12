import { DataSource } from 'typeorm';
import { UserRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/user.typeorm.repository';
import { RoleRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role.typeorm.repository';
import { PermissionRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/permission.typeorm.repository';
import { RolePermissionRepositoryTypeorm } from '@users/infrastructure/typeorm/repositories/role-permission.typeorm.repository';
import { User, Role, Permission, RolePermission } from '../typeorm/entities';

export const USER_REPOSITORY_PROVIDER = 'USER_REPOSITORY';
export const ROLE_REPOSITORY_PROVIDER = 'ROLE_REPOSITORY';
export const PERMISSION_REPOSITORY_PROVIDER = 'PERMISSION_REPOSITORY';
export const ROLE_PERMISSION_REPOSITORY_PROVIDER = 'ROLE_PERMISSION_REPOSITORY';

export const userRepositoryProvider = {
  provide: USER_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new UserRepositoryTypeorm(dataSource.getRepository(User));
  },
  inject: ['DATA_SOURCE'],
};

export const roleRepositoryProvider = {
  provide: ROLE_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new RoleRepositoryTypeorm(dataSource.getRepository(Role));
  },
  inject: ['DATA_SOURCE'],
};

export const permissionRepositoryProvider = {
  provide: PERMISSION_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new PermissionRepositoryTypeorm(
      dataSource.getRepository(Permission),
    );
  },
  inject: ['DATA_SOURCE'],
};

export const rolePermissionRepositoryProvider = {
  provide: ROLE_PERMISSION_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new RolePermissionRepositoryTypeorm(
      dataSource.getRepository(RolePermission),
    );
  },
  inject: ['DATA_SOURCE'],
};
