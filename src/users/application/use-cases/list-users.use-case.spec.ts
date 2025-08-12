/* eslint-disable @typescript-eslint/unbound-method */
import { ListUsersUseCase } from './list-users.use-case';
import { UserRepository, RoleRepository } from '@users/domain/repositories';
import { ListUsersRequest } from '@users/application/inputs';
import { ListUsersResponse } from '@users/application/outputs';
import { User, Role } from '@users/domain/entities';
import {
  UserName,
  UserEmail,
  RoleName,
  UserId,
  RoleId,
  RoleDescription,
} from '@users/domain/value-objects';
import { PasswordHash } from '@users/domain/value-objects';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;

  const mockUserId1 = UserId.generate();
  const mockUserId2 = UserId.generate();
  const mockRoleId1 = RoleId.generate();
  const mockRoleId2 = RoleId.generate();

  const mockUsers = [
    {
      id: mockUserId1,
      name: new UserName('John Doe'),
      email: new UserEmail('john@example.com'),
      passwordHash: new PasswordHash('hashed-password-1'),
      roleId: mockRoleId1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: mockUserId2,
      name: new UserName('Jane Smith'),
      email: new UserEmail('jane@example.com'),
      password: new PasswordHash('hashed-password-2'),
      roleId: mockRoleId2,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ] as User[];

  const mockRoles = [
    {
      id: mockRoleId1,
      name: RoleName.admin(),
      description: new RoleDescription('Admin role'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: mockRoleId2,
      name: RoleName.member(),
      description: new RoleDescription('Member role'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ] as Role[];

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

    useCase = new ListUsersUseCase(mockUserRepository, mockRoleRepository);
  });

  describe('execute', () => {
    it('debería listar usuarios exitosamente sin filtros', async () => {
      // Arrange
      const request: ListUsersRequest = {};
      mockUserRepository.list.mockResolvedValue(mockUsers);
      mockUserRepository.count.mockResolvedValue(2);
      mockRoleRepository.findById
        .mockResolvedValueOnce(mockRoles[0])
        .mockResolvedValueOnce(mockRoles[1]);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(mockUserRepository.list).toHaveBeenCalledWith(expect.any(Object));
      expect(mockUserRepository.count).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRoleRepository.findById).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(ListUsersResponse);
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.limit).toBe(10); // Default limit
      expect(result.offset).toBe(0); // Default offset
      expect(result.users[0].name).toBe('John Doe');
      expect(result.users[0].roleName).toBe('administrator');
      expect(result.users[1].name).toBe('Jane Smith');
      expect(result.users[1].roleName).toBe('member');
    });

    it('debería listar usuarios con filtros', async () => {
      // Arrange
      const request: ListUsersRequest = {
        name: 'John',
        email: 'john@example.com',
        roleName: 'admin',
        limit: 5,
        offset: 10,
      };
      mockUserRepository.list.mockResolvedValue([mockUsers[0]]);
      mockUserRepository.count.mockResolvedValue(1);
      mockRoleRepository.findById.mockResolvedValue(mockRoles[0]);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(mockUserRepository.list).toHaveBeenCalledWith(expect.any(Object));
      expect(mockUserRepository.count).toHaveBeenCalledWith(expect.any(Object));
      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(5);
      expect(result.offset).toBe(10);
    });

    it('debería manejar usuarios sin roles encontrados', async () => {
      // Arrange
      const request: ListUsersRequest = {};
      mockUserRepository.list.mockResolvedValue(mockUsers);
      mockUserRepository.count.mockResolvedValue(2);
      mockRoleRepository.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.users).toHaveLength(2);
      expect(result.users[0].roleName).toBe('Unknown');
      expect(result.users[1].roleName).toBe('Unknown');
    });

    it('debería manejar lista vacía de usuarios', async () => {
      // Arrange
      const request: ListUsersRequest = {};
      mockUserRepository.list.mockResolvedValue([]);
      mockUserRepository.count.mockResolvedValue(0);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.users).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockRoleRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando el conteo de usuarios falla', async () => {
      // Arrange
      const request: ListUsersRequest = {};
      mockUserRepository.list.mockResolvedValue(mockUsers);
      mockUserRepository.count.mockRejectedValue(new Error('Count error'));

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Count error');
      expect(mockUserRepository.list).toHaveBeenCalledWith(expect.any(Object));
      expect(mockUserRepository.count).toHaveBeenCalledWith(expect.any(Object));
    });

    it('debería lanzar error cuando la búsqueda de roles falla', async () => {
      // Arrange
      const request: ListUsersRequest = {};
      mockUserRepository.list.mockResolvedValue(mockUsers);
      mockUserRepository.count.mockResolvedValue(2);
      mockRoleRepository.findById.mockRejectedValue(
        new Error('Role database error'),
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        'Role database error',
      );
      expect(mockUserRepository.list).toHaveBeenCalledWith(expect.any(Object));
      expect(mockUserRepository.count).toHaveBeenCalledWith(expect.any(Object));
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });
});
