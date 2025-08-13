import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserAPIService } from '../services/user-api.service';
import {
  CreateRoleRequest,
  AssignRolePermissionsRequest,
} from '@users/application/inputs';
import { PermissionGuard } from '@auth/infrastructure/guards/permission.guard';
import { RequirePermissions } from '@auth/infrastructure/decorators/permissions.decorator';
import { PermissionNameEnum } from '@users/domain/value-objects/permission-name.value-object';

@UseGuards(PermissionGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly userAPIService: UserAPIService) {}

  @Post()
  @RequirePermissions(PermissionNameEnum.CREATE_ROLE)
  createRole(@Body() createRoleRequest: CreateRoleRequest) {
    return this.userAPIService.createRole(createRoleRequest);
  }

  @Get()
  @RequirePermissions(PermissionNameEnum.VIEW_ROLES)
  listRoles() {
    return this.userAPIService.listRoles();
  }

  @Put('permissions')
  @RequirePermissions(PermissionNameEnum.MANAGE_ROLE_PERMISSIONS)
  assignRolePermissions(
    @Body() assignRolePermissionsRequest: AssignRolePermissionsRequest,
  ) {
    return this.userAPIService.assignRolePermissions(
      assignRolePermissionsRequest,
    );
  }
}
