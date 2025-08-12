import {
  RoleRepository,
  RolePermissionRepository,
  PermissionRepository,
} from '@users/domain/repositories';
import {
  ListRolesResponse,
  RoleSummary,
} from '@users/application/outputs/list-roles.response.dto';

export class ListRolesUseCase {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  public async execute(): Promise<ListRolesResponse> {
    // Obtener todos los roles
    const roles = await this.roleRepository.list();

    // Obtener permisos para cada rol
    const roleSummaries = await Promise.all(
      roles.map(async (role) => {
        const rolePermissions =
          await this.rolePermissionRepository.findByRoleId(role.id);

        const permissionNames = rolePermissions
          .filter(Boolean)
          .map((permission) => permission.name.value);

        return new RoleSummary(
          role.id.value,
          role.name.value,
          role.description.value,
          permissionNames,
          role.createdAt,
        );
      }),
    );

    return new ListRolesResponse(roleSummaries);
  }
}
