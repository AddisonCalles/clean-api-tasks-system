import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { UserId } from '@users/domain/value-objects';
import { GetUserResponse } from '@users/application/outputs/get-user.response.dto';
import {
  UserNotFoundException,
  RoleNotFoundException,
} from '@users/domain/exceptions';

export class GetUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  public async execute(userId: UserId): Promise<GetUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.id.value) {
      throw new UserNotFoundException(userId.value);
    }

    // Obtener información del rol
    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new RoleNotFoundException(user.roleId.value);
    }

    return new GetUserResponse(
      user.id.value,
      user.name.value,
      user.email.value,
      role.name.value,
      user.createdAt,
      user.updatedAt,
    );
  }
}
