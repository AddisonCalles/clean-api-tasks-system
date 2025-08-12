import { User } from '@users/domain/entities';
import { UserRepository, RoleRepository } from '@users/domain/repositories';
import {
  UserName,
  UserEmail,
  UserPassword,
  RoleName,
} from '@users/domain/value-objects';
import { CreateUserRequest } from '@users/application/inputs/create-user.request.dto';
import { CreateUserResponse } from '@users/application/outputs/create-user.response.dto';
import { ValidationException } from '@shared/domain/exceptions';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHash: PasswordHashPort,
  ) {}

  public async execute(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    // Validar y crear value objects
    const name = new UserName(request.name);
    const email = new UserEmail(request.email);
    const password = new UserPassword(request.password);
    const roleName = RoleName.member(); // Default

    // Verificar que el rol existe
    const role = await this.roleRepository.findByName(roleName);

    if (!role) {
      throw new Error(
        'Role not found. Please execute the script to initialize the default roles',
      );
    }

    // Verificar que el email no esté en uso
    const existingUser = await this.userRepository.findByEmail(email.value);
    if (existingUser) {
      throw new ValidationException('Email is already in use');
    }

    const passwordHash = await this.passwordHash.hash(password);

    // Crear el usuario usando el factory method
    const user = User.create(name, email, passwordHash, role.id);

    // Guardar el usuario
    await this.userRepository.create(user);

    // Retornar respuesta
    return new CreateUserResponse(
      user.id.value,
      user.name.value,
      user.email.value,
      roleName.value,
      user.createdAt,
    );
  }
}
