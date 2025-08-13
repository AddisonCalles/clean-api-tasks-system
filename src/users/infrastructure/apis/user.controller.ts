import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserAPIService } from '../services/user-api.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ListUsersRequest,
} from '@users/application/inputs';
import type { EntityID } from '@shared/domain/value-objects';
import { PermissionGuard } from '@auth/infrastructure/guards/permission.guard';
import {
  RequiredCreateUserPermissions,
  RequiredDeleteUserPermissions,
  RequiredEditUserPermissions,
  RequiredListUsersPermissions,
  RequiredViewUserPermissions,
} from '../decorators';

@UseGuards(PermissionGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userAPIService: UserAPIService) {}

  @Post()
  @RequiredCreateUserPermissions()
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.userAPIService.createUser(createUserRequest);
  }

  @Get()
  @RequiredListUsersPermissions()
  listUsers(@Query() listUsersRequest: ListUsersRequest) {
    return this.userAPIService.listUsers(listUsersRequest);
  }

  @Get(':id')
  @RequiredViewUserPermissions()
  getUserById(@Param('id') id: EntityID) {
    return this.userAPIService.getUserById(id);
  }

  @Patch(':id')
  @RequiredEditUserPermissions()
  updateUser(
    @Param('id') id: EntityID,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return this.userAPIService.updateUser(id, updateUserRequest);
  }

  @Delete(':id')
  @RequiredDeleteUserPermissions()
  deleteUser(@Param('id') id: EntityID) {
    return this.userAPIService.deleteUser(id);
  }
}
