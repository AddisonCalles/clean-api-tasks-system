import { Inject, Injectable } from '@nestjs/common';
import { UserId } from '@users/domain/value-objects';
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
  CREATE_USER_USECASE,
  GET_USER_USECASE,
  LIST_USERS_USECASE,
  UPDATE_USER_USECASE,
  DELETE_USER_USECASE,
  CREATE_ROLE_USECASE,
  LIST_ROLES_USECASE,
  ASSIGN_ROLE_PERMISSIONS_USECASE,
  INITIALIZE_DEFAULT_ROLES_USECASE,
} from '../providers/user-usecases.providers';
import type {
  CreateUserRequest,
  UpdateUserRequest,
  ListUsersRequest,
  CreateRoleRequest,
  AssignRolePermissionsRequest,
} from '@users/application/inputs';
import type {
  CreateUserResponse,
  GetUserResponse,
  ListUsersResponse,
  UpdateUserResponse,
  CreateRoleResponse,
  ListRolesResponse,
} from '@users/application/outputs';
import { HandleDomainExceptions } from '@shared/infrastructure/exception.validator';
import type { EntityID } from '@shared/domain/value-objects';

@Injectable()
export class UserAPIService {
  constructor(
    @Inject(CREATE_USER_USECASE)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(GET_USER_USECASE)
    private readonly getUserUseCase: GetUserUseCase,
    @Inject(LIST_USERS_USECASE)
    private readonly listUsersUseCase: ListUsersUseCase,
    @Inject(UPDATE_USER_USECASE)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(DELETE_USER_USECASE)
    private readonly deleteUserUseCase: DeleteUserUseCase,
    @Inject(CREATE_ROLE_USECASE)
    private readonly createRoleUseCase: CreateRoleUseCase,
    @Inject(LIST_ROLES_USECASE)
    private readonly listRolesUseCase: ListRolesUseCase,
    @Inject(ASSIGN_ROLE_PERMISSIONS_USECASE)
    private readonly assignRolePermissionsUseCase: AssignRolePermissionsUseCase,
  ) {}

  @HandleDomainExceptions
  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    return await this.createUserUseCase.execute(request);
  }

  @HandleDomainExceptions
  async getUserById(userId: EntityID): Promise<GetUserResponse> {
    const userIdVO = new UserId(userId);
    return await this.getUserUseCase.execute(userIdVO);
  }

  @HandleDomainExceptions
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    return await this.listUsersUseCase.execute(request);
  }

  @HandleDomainExceptions
  async updateUser(
    userId: EntityID,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const userIdVO = new UserId(userId);
    return await this.updateUserUseCase.execute(userIdVO, request);
  }

  @HandleDomainExceptions
  async deleteUser(userId: EntityID): Promise<void> {
    const userIdVO = new UserId(userId);
    await this.deleteUserUseCase.execute(userIdVO);
  }

  @HandleDomainExceptions
  async createRole(request: CreateRoleRequest): Promise<CreateRoleResponse> {
    return await this.createRoleUseCase.execute(request);
  }

  @HandleDomainExceptions
  async listRoles(): Promise<ListRolesResponse> {
    return await this.listRolesUseCase.execute();
  }

  @HandleDomainExceptions
  async assignRolePermissions(
    request: AssignRolePermissionsRequest,
  ): Promise<void> {
    await this.assignRolePermissionsUseCase.execute(request);
  }
}
