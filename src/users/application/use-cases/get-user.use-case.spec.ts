import { GetUserUseCase } from './get-user.use-case';
import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { GetUserResponse } from '@users/application/outputs/get-user.response.dto';
import { User } from '@users/domain/entities';
import { Role } from '@users/domain/entities';
import {
  UserName,
  UserEmail,
  RoleName,
  UserId,
  RoleId,
} from '@users/domain/value-objects';
import {
  UserNotFoundException,
  RoleNotFoundException,
} from '@users/domain/exceptions';
import { PasswordHash } from '@users/domain/value-objects';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;

  const mockUserId = UserId.generate();
  const mockRoleId = RoleId.generate();
  const mockRoleName = new RoleName('administrator');

  const mockUser = {
    id: mockUserId,
    name: new UserName('John Doe'),
    email: new UserEmail('john@example.com'),
    password: new PasswordHash('hashed-password-123'),
    roleId: mockRoleId,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as unknown as User;

  const mockRole = {
    id: mockRoleId,
    name: mockRoleName,
    description: { value: 'Admin role' },
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

    useCase = new GetUserUseCase(mockUserRepository, mockRoleRepository);
  });

  describe('execute', () => {
    it('debería obtener un usuario exitosamente', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      // Act
      const result = await useCase.execute(mockUserId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
      expect(result).toBeInstanceOf(GetUserResponse);
      expect(result.id).toBe(mockUserId.value);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.roleName).toBe('administrator');
      expect(result.createdAt).toEqual(new Date('2024-01-01'));
      expect(result.updatedAt).toEqual(new Date('2024-01-01'));
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar RoleNotFoundException cuando el rol no existe', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow(
        RoleNotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
    });

    it('debería lanzar error cuando la búsqueda del usuario falla', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow(
        'Database error',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda del rol falla', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockRoleRepository.findById.mockRejectedValue(
        new Error('Role database error'),
      );

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow(
        'Role database error',
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
    });
  });
});
