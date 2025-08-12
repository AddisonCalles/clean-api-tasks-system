import { UserRepository, RoleRepository } from '@users/domain/repositories';
import {
  UserId,
  UserName,
  UserEmail,
  UserPassword,
  RoleName,
} from '@users/domain/value-objects';
import { UpdateUserRequest } from '@users/application/inputs/update-user.request.dto';
import { UpdateUserResponse } from '@users/application/outputs/update-user.response.dto';
import {
  UserNotFoundException,
  RoleNotFoundException,
} from '@users/domain/exceptions';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';
import { ValidationException } from '@shared/domain/exceptions';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHash: PasswordHashPort,
  ) {}

  public async execute(
    userId: UserId,
    request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId.value);
    }

    // Actualizar campos si se proporcionan
    if (request.name !== undefined) {
      const name = new UserName(request.name);
      user.updateName(name);
    }

    if (request.email !== undefined) {
      const email = new UserEmail(request.email);

      // Verificar que el email no esté en uso por otro usuario
      const existingUser = await this.userRepository.findByEmail(email.value);
      if (existingUser && !existingUser.id.equals(userId)) {
        throw new ValidationException('Email is already in use');
      }

      user.updateEmail(email);
    }

    if (request.password !== undefined) {
      const password = new UserPassword(request.password);
      user.updatePassword(await this.passwordHash.hash(password));
    }

    let roleName = '';
    if (request.roleName !== undefined) {
      const roleNameVO = new RoleName(request.roleName);
      const role = await this.roleRepository.findByName(roleNameVO);

      if (!role) {
        throw new RoleNotFoundException(request.roleName);
      }

      user.updateRole(role.id);
      roleName = role.name.value;
    } else {
      // Obtener el nombre del rol actual
      const currentRole = await this.roleRepository.findById(user.roleId);
      roleName = currentRole?.name.value || 'Unknown';
    }

    // Guardar cambios
    await this.userRepository.update(user);

    // Retornar respuesta actualizada
    return new UpdateUserResponse(
      user.id.value,
      user.name.value,
      user.email.value,
      roleName,
      user.updatedAt,
    );
  }
}
