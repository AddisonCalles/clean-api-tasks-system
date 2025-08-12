/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateUserUseCase } from './update-user.use-case';
import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';
import { UpdateUserRequest } from '@users/application/inputs/update-user.request.dto';
import { UpdateUserResponse } from '@users/application/outputs/update-user.response.dto';
import { User } from '@users/domain/entities';
import { Role } from '@users/domain/entities';
import {
  UserName,
  UserEmail,
  UserPassword,
  RoleName,
  UserId,
  RoleId,
} from '@users/domain/value-objects';
import {
  UserNotFoundException,
  RoleNameInvalidException,
} from '@users/domain/exceptions';
import { PasswordHash } from '@users/domain/value-objects';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockPasswordHash: jest.Mocked<PasswordHashPort>;

  const mockUserId = UserId.generate();
  const mockRoleId = RoleId.generate();
  const mockRoleName = new RoleName('administrator');
  const mockHashedPassword = new PasswordHash('hashed-password-123');

  let mockUser: User;

  const mockRole = {
    id: mockRoleId,
    name: mockRoleName,
    description: { value: 'Admin role' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as Role;

  beforeEach(() => {
    mockUser = {
      id: mockUserId,
      name: new UserName('John Doe'),
      email: new UserEmail('john@example.com'),
      passwordHash: mockHashedPassword,
      roleId: mockRoleId,
      updateName: jest.fn(),
      updateEmail: jest.fn(),
      updatePassword: jest.fn(),
      updateRole: jest.fn(),
    } as unknown as User;

    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    };

    mockRoleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
    };

    mockPasswordHash = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    useCase = new UpdateUserUseCase(
      mockUserRepository,
      mockRoleRepository,
      mockPasswordHash,
    );
  });

  describe('execute', () => {
    it('debería actualizar solo el nombre del usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = { name: 'Jane Doe' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      // Act
      const result = await useCase.execute(mockUserId, request);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.updateName).toHaveBeenCalledWith(expect.any(UserName));
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(UpdateUserResponse);
      expect(result.name).toBe('John Doe'); // El nombre original del mock
    });

    it('debería actualizar solo el email del usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = { email: 'jane@example.com' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      // Act
      const result = await useCase.execute(mockUserId, request);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'jane@example.com',
      );
      expect(mockUser.updateEmail).toHaveBeenCalledWith(expect.any(UserEmail));
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(UpdateUserResponse);
    });

    it('debería actualizar solo la contraseña del usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = { password: 'newpassword123' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPasswordHash.hash.mockResolvedValue(
        new PasswordHash('new-hashed-password'),
      );

      // Act
      const result = await useCase.execute(mockUserId, request);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockPasswordHash.hash).toHaveBeenCalledWith(
        expect.any(UserPassword),
      );
      expect(mockUser.updatePassword).toHaveBeenCalledWith(
        expect.any(PasswordHash),
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(UpdateUserResponse);
    });

    it('debería actualizar solo el rol del usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = { roleName: 'administrator' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findByName.mockResolvedValue(mockRole);

      // Act
      const result = await useCase.execute(mockUserId, request);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(
        expect.any(RoleName),
      );
      expect(mockUser.updateRole).toHaveBeenCalledWith(mockRoleId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(UpdateUserResponse);
    });

    it('debería actualizar múltiples campos del usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'newpassword123',
        roleName: 'administrator',
      };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockPasswordHash.hash.mockResolvedValue(
        new PasswordHash('new-hashed-password'),
      );

      // Act
      const result = await useCase.execute(mockUserId, request);

      // Assert
      expect(mockUser.updateName).toHaveBeenCalledWith(expect.any(UserName));
      expect(mockUser.updateEmail).toHaveBeenCalledWith(expect.any(UserEmail));
      expect(mockUser.updatePassword).toHaveBeenCalledWith(
        expect.any(PasswordHash),
      );
      expect(mockUser.updateRole).toHaveBeenCalledWith(mockRoleId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(result).toBeInstanceOf(UpdateUserResponse);
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      // Arrange
      const request: UpdateUserRequest = { name: 'Jane Doe' };
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockUserId, request)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el email ya está en uso por otro usuario', async () => {
      // Arrange
      const request: UpdateUserRequest = { email: 'existing@example.com' };
      const existingUser = { ...mockUser, id: UserId.generate() };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(useCase.execute(mockUserId, request)).rejects.toThrow(
        'Email is already in use',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'existing@example.com',
      );
      expect(mockUser.updateEmail).not.toHaveBeenCalled();
    });

    it('debería lanzar RoleNameInvalidException cuando el rol no existe', async () => {
      // Arrange
      const request: UpdateUserRequest = { roleName: 'nonexistent' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockUserId, request)).rejects.toThrow(
        RoleNameInvalidException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findByName).not.toHaveBeenCalled();
      expect(mockUser.updateRole).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el hash de contraseña falla', async () => {
      // Arrange
      const request: UpdateUserRequest = { password: 'newpassword123' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordHash.hash.mockRejectedValue(new Error('Hash error'));

      // Act & Assert
      await expect(useCase.execute(mockUserId, request)).rejects.toThrow(
        'Hash error',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockPasswordHash.hash).toHaveBeenCalledWith(
        expect.any(UserPassword),
      );
      expect(mockUser.updatePassword).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la actualización del usuario falla', async () => {
      // Arrange
      const request: UpdateUserRequest = { name: 'Jane Doe' };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockUserRepository.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(mockUserId, request)).rejects.toThrow(
        'Database error',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.updateName).toHaveBeenCalledWith(expect.any(UserName));
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
