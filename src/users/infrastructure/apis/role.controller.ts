import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserAPIService } from '../services/user-api.service';
import {
  CreateRoleRequest,
  AssignRolePermissionsRequest,
} from '@users/application/inputs';

@Controller('roles')
export class RoleController {
  constructor(private readonly userAPIService: UserAPIService) {}

  @Post()
  createRole(@Body() createRoleRequest: CreateRoleRequest) {
    return this.userAPIService.createRole(createRoleRequest);
  }

  @Get()
  listRoles() {
    return this.userAPIService.listRoles();
  }

  @Put('permissions')
  assignRolePermissions(
    @Body() assignRolePermissionsRequest: AssignRolePermissionsRequest,
  ) {
    return this.userAPIService.assignRolePermissions(
      assignRolePermissionsRequest,
    );
  }
}
