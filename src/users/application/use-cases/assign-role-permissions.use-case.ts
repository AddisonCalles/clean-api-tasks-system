import { RolePermission } from '@users/domain/entities';
import {
  RoleRepository,
  PermissionRepository,
  RolePermissionRepository,
} from '@users/domain/repositories';
import { RoleId, PermissionId } from '@users/domain/value-objects';
import { AssignRolePermissionsRequest } from '@users/application/inputs/assign-role-permissions.request.dto';
import {
  RoleNotFoundException,
  PermissionNotFoundException,
} from '@users/domain/exceptions';
import { EntityID } from '@shared/domain/value-objects';

export class AssignRolePermissionsUseCase {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  public async execute(request: AssignRolePermissionsRequest): Promise<void> {
    const roleId = new RoleId(request.roleId);

    // Verificar que el rol existe
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new RoleNotFoundException(request.roleId);
    }

    // Verificar que todos los permisos existen
    const permissionIds = request.permissionIds.map(
      (id) => new PermissionId(id),
    );
    const permissions = await Promise.all(
      permissionIds.map((id) => this.permissionRepository.findById(id)),
    );

    for (let i = 0; i < permissions.length; i++) {
      if (!permissions[i]) {
        throw new PermissionNotFoundException(request.permissionIds[i]);
      }
    }

    // Eliminar permisos existentes del rol (para reemplazarlos)
    const existingRolePermissions =
      await this.rolePermissionRepository.findByRoleId(roleId);
    for (const rolePermission of existingRolePermissions) {
      await this.rolePermissionRepository.delete(roleId, rolePermission.id);
    }

    // Asignar nuevos permisos
    for (const permissionId of permissionIds) {
      const rolePermission = RolePermission.create(roleId, permissionId);
      await this.rolePermissionRepository.create(rolePermission);
    }
  }
}
