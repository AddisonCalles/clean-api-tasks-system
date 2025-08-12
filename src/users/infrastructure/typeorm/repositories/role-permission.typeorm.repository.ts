import { Repository } from 'typeorm';
import { RolePermissionRepository } from '@users/domain/repositories';
import { RolePermission as RolePermissionModel } from '@users/infrastructure/typeorm/entities';
import { Permission, RolePermission } from '@users/domain/entities';
import {
  RoleId,
  PermissionId,
  PermissionName,
  PermissionDescription,
} from '@users/domain/value-objects';

export class RolePermissionRepositoryTypeorm
  implements RolePermissionRepository
{
  constructor(
    private readonly rolePermissionRepository: Repository<RolePermissionModel>,
  ) {}

  async create(rolePermission: RolePermission): Promise<void> {
    const rolePermissionModel = new RolePermissionModel();
    rolePermissionModel.role_id = rolePermission.roleId.value;
    rolePermissionModel.permission_id = rolePermission.permissionId.value;
    rolePermissionModel.created_at = rolePermission.createdAt;

    await this.rolePermissionRepository.save(rolePermissionModel);
  }

  async delete(roleId: RoleId, permissionId: PermissionId): Promise<void> {
    await this.rolePermissionRepository.delete({
      role_id: roleId.value,
      permission_id: permissionId.value,
    });
  }

  async findByRoleId(roleId: RoleId): Promise<Permission[]> {
    // Usamos una sola consulta con join para obtener los permisos asociados al rol
    const rolePermissionsWithPerms = await this.rolePermissionRepository.find({
      where: { role_id: roleId.value },
      relations: ['permission'],
      order: { created_at: 'ASC' },
    });

    // Mapear directamente a entidades de dominio Permission
    return rolePermissionsWithPerms
      .filter((model) => model.permission)
      .map((model) => {
        const perm = model.permission;
        // Asumiendo que Permission tiene un método estático reconstitute similar
        return Permission.reconstitute(
          new PermissionId(perm.id),
          new PermissionName(perm.name),
          new PermissionDescription(perm.description),
          perm.created_at,
          perm.updated_at,
          perm.deleted_at,
        );
      });
  }

  async findByPermissionId(
    permissionId: PermissionId,
  ): Promise<RolePermission[]> {
    const rolePermissionModels = await this.rolePermissionRepository.find({
      where: { permission_id: permissionId.value },
      order: { created_at: 'ASC' },
    });

    return rolePermissionModels.map((model) => this.toDomainEntity(model));
  }

  async exists(roleId: RoleId, permissionId: PermissionId): Promise<boolean> {
    const count = await this.rolePermissionRepository.count({
      where: {
        role_id: roleId.value,
        permission_id: permissionId.value,
      },
    });

    return count > 0;
  }

  private toDomainEntity(
    rolePermissionModel: RolePermissionModel,
  ): RolePermission {
    return RolePermission.reconstitute(
      new RoleId(rolePermissionModel.role_id),
      new PermissionId(rolePermissionModel.permission_id),
      rolePermissionModel.created_at,
    );
  }
}
