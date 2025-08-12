import {
  UserRepository,
  RoleRepository,
  RolePermissionRepository,
} from '@users/domain/repositories';
import {
  PasswordHash,
  UserEmail,
  UserPassword,
} from '@users/domain/value-objects';
import {
  UserNotFoundException,
  UserPasswordInvalidException,
} from '@users/domain/exceptions';
import { AuthenticateUserRequest } from '@auth/application/inputs';
import { AuthenticateUserResponse } from '@auth/application/outputs';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';
import { SessionManagerPort } from '../ports';

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly passwordHash: PasswordHashPort,
    private readonly sessionManager: SessionManagerPort,
  ) {}

  public async execute(
    request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    const email = new UserEmail(request.email);
    const password = new UserPassword(request.password);

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(email.value);
    if (!user || user.isDeleted()) {
      throw new UserNotFoundException(email.value);
    }

    // Validar contraseña (esto se haría con bcrypt en infraestructura)
    // Por ahora solo comparamos directamente
    if (!(await this.passwordHash.compare(password, user.passwordHash))) {
      throw new UserPasswordInvalidException(email.value);
    }

    // Obtener rol y permisos
    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new Error('User role not found');
    }

    const rolePermissions = await this.rolePermissionRepository.findByRoleId(
      role.id,
    );
    const permissions = rolePermissions?.map((rp) => rp.name.value) ?? [];

    const session = await this.sessionManager.createSession(
      user.id.value,
      user.email.value,
      role.name.value,
    );

    return {
      session,
      name: user.name.value,
      permissions,
    };
  }
}
