import { Role } from '@users/domain/entities';
import { RoleRepository } from '@users/domain/repositories';
import { RoleName, RoleDescription } from '@users/domain/value-objects';
import { CreateRoleRequest } from '@users/application/inputs/create-role.request.dto';
import { CreateRoleResponse } from '@users/application/outputs/create-role.response.dto';

export class CreateRoleUseCase {
  constructor(private readonly roleRepository: RoleRepository) {}

  public async execute(
    request: CreateRoleRequest,
  ): Promise<CreateRoleResponse> {
    // Validar y crear value objects
    const name = new RoleName(request.name);
    const description = new RoleDescription(request.description || '');

    // Verificar que el rol no exista
    const existingRole = await this.roleRepository.findByName(name);
    if (existingRole) {
      throw new Error('Role name already exists');
    }

    // Crear el rol usando el factory method
    const role = Role.create(name, description);

    // Guardar el rol
    await this.roleRepository.create(role);

    // Retornar respuesta
    return new CreateRoleResponse(
      role.id.value,
      role.name.value,
      role.description.value,
      role.createdAt,
    );
  }
}
