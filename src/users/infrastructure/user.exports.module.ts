import { Module } from '@nestjs/common';
import {
  permissionRepositoryProvider,
  rolePermissionRepositoryProvider,
  roleRepositoryProvider,
  userRepositoryProvider,
} from './providers/user-repository.providers';
import {
  createUserUseCaseProvider,
  getUserUseCaseProvider,
  listUsersUseCaseProvider,
  updateUserUseCaseProvider,
  deleteUserUseCaseProvider,
  createRoleUseCaseProvider,
  listRolesUseCaseProvider,
  assignRolePermissionsUseCaseProvider,
  passwordHashPortProvider,
} from './providers/user-usecases.providers';
import { DatabaseModule } from '@shared/infrastructure/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    userRepositoryProvider,
    roleRepositoryProvider,
    permissionRepositoryProvider,
    rolePermissionRepositoryProvider,
    createUserUseCaseProvider,
    getUserUseCaseProvider,
    listUsersUseCaseProvider,
    updateUserUseCaseProvider,
    deleteUserUseCaseProvider,
    createRoleUseCaseProvider,
    listRolesUseCaseProvider,
    assignRolePermissionsUseCaseProvider,
    passwordHashPortProvider,
  ],
  exports: [
    userRepositoryProvider,
    roleRepositoryProvider,
    permissionRepositoryProvider,
    rolePermissionRepositoryProvider,
    createUserUseCaseProvider,
    getUserUseCaseProvider,
    listUsersUseCaseProvider,
    updateUserUseCaseProvider,
    deleteUserUseCaseProvider,
    createRoleUseCaseProvider,
    listRolesUseCaseProvider,
    assignRolePermissionsUseCaseProvider,
    passwordHashPortProvider,
  ],
})
export class UserExportsModule {}
