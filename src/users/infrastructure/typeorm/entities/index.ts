export { User } from './user.entity';
export { Role } from './role.entity';
export { Permission } from './permission.entity';
export { RolePermission } from './role-permission.entity';

import { User } from './user.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
export const userEntities = [User, Role, Permission, RolePermission];
