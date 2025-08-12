import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { UserFilter } from '@users/domain/value-objects';
import { ListUsersRequest } from '@users/application/inputs/list-users.request.dto';
import {
  ListUsersResponse,
  UserSummary,
} from '@users/application/outputs/list-users.response.dto';

export class ListUsersUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  public async execute(request: ListUsersRequest): Promise<ListUsersResponse> {
    // Crear filtro
    const filter = new UserFilter({
      name: request.name,
      email: request.email,
      roleName: request.roleName,
      limit: request.limit,
      offset: request.offset,
    });

    // Obtener usuarios y conteo total
    const [users, total] = await Promise.all([
      this.userRepository.list(filter),
      this.userRepository.count(filter),
    ]);

    // Obtener roles para mapear nombres
    const roleIds = [...new Set(users.map((user) => user.roleId.value))];
    const roles = await Promise.all(
      roleIds.map((id) => this.roleRepository.findById({ value: id } as any)),
    );
    const roleMap = new Map(
      roles.filter(Boolean).map((role) => [role!.id.value, role!.name.value]),
    );

    // Mapear a DTOs de respuesta
    const userSummaries = users.map(
      (user) =>
        new UserSummary(
          user.id.value,
          user.name.value,
          user.email.value,
          roleMap.get(user.roleId.value) || 'Unknown',
          user.createdAt,
        ),
    );

    return new ListUsersResponse(
      userSummaries,
      total,
      filter.getLimit(),
      filter.getOffset(),
    );
  }
}
