/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { PasswordHashPort } from '@users/application/ports/password-hash.port';
import { CreateUserRequest } from '@users/application/inputs/create-user.request.dto';
import { CreateUserResponse } from '@users/application/outputs/create-user.response.dto';
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
import { ValidationException } from '@shared/domain/exceptions';
import { PasswordHash } from '@users/domain/value-objects';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockPasswordHash: jest.Mocked<PasswordHashPort>;

  const mockUserId = UserId.generate();
  const mockRoleId = RoleId.generate();
  const mockRoleName = RoleName.member();
  const mockHashedPassword = new PasswordHash('hashed-password-123');

  const mockUser = {
    id: mockUserId,
    name: new UserName('John Doe'),
    email: new UserEmail('john@example.com'),
    password: mockHashedPassword,
    roleId: mockRoleId,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRole = {
    id: mockRoleId,
    name: mockRoleName,
    description: { value: 'Member role' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as Role;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
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

    useCase = new CreateUserUseCase(
      mockUserRepository,
      mockRoleRepository,
      mockPasswordHash,
    );
  });

  describe('execute', () => {
    const validRequest: CreateUserRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('debería crear un usuario exitosamente', async () => {
      // Arrange
      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHash.hash.mockResolvedValue(mockHashedPassword);
      mockUserRepository.create.mockResolvedValue();

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(mockRoleName);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockPasswordHash.hash).toHaveBeenCalledWith(
        expect.any(UserPassword),
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
      expect(result).toBeInstanceOf(CreateUserResponse);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.roleName).toBe(mockRoleName.value);
    });

    it('debería lanzar error cuando el rol no existe', async () => {
      // Arrange
      mockRoleRepository.findByName.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        'Role not found. Please execute the script to initialize the default roles',
      );
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(mockRoleName);
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('debería lanzar ValidationException cuando el email ya está en uso', async () => {
      // Arrange
      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        ValidationException,
      );
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        'Email is already in use',
      );
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(mockRoleName);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockPasswordHash.hash).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el hash de contraseña falla', async () => {
      // Arrange
      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHash.hash.mockRejectedValue(new Error('Hash error'));

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow('Hash error');
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(mockRoleName);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockPasswordHash.hash).toHaveBeenCalledWith(
        expect.any(UserPassword),
      );
    });

    it('debería lanzar error cuando la creación del usuario falla', async () => {
      // Arrange
      mockRoleRepository.findByName.mockResolvedValue(mockRole);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordHash.hash.mockResolvedValue(mockHashedPassword);
      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(validRequest)).rejects.toThrow(
        'Database error',
      );
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(mockRoleName);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockPasswordHash.hash).toHaveBeenCalledWith(
        expect.any(UserPassword),
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
    });
  });
});
