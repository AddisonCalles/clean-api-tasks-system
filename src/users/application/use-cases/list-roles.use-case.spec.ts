import { ListRolesUseCase } from './list-roles.use-case';
import {
  RoleRepository,
  RolePermissionRepository,
  PermissionRepository,
} from '@users/domain/repositories';
import { ListRolesResponse } from '@users/application/outputs/list-roles.response.dto';
import { Role, Permission, RolePermission } from '@users/domain/entities';
import { RoleId, PermissionId, RoleName } from '@users/domain/value-objects';

describe('ListRolesUseCase', () => {
  let useCase: ListRolesUseCase;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockRolePermissionRepository: jest.Mocked<RolePermissionRepository>;
  let mockPermissionRepository: jest.Mocked<PermissionRepository>;

  const mockRoleId1 = RoleId.generate();
  const mockRoleId2 = RoleId.generate();
  const mockPermissionId1 = PermissionId.generate();
  const mockPermissionId2 = PermissionId.generate();

  const mockRoles = [
    {
      id: mockRoleId1,
      name: RoleName.admin(),
      description: { value: 'Admin role' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: mockRoleId2,
      name: RoleName.member(),
      description: { value: 'Member role' },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
  ] as Role[];

  const mockPermissions = [
    {
      id: mockPermissionId1,
      name: { value: 'create_task' },
      description: { value: 'Create task permission' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: mockPermissionId2,
      name: { value: 'edit_task' },
      description: { value: 'Edit task permission' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ] as Permission[];

  const mockRolePermissions = [
    {
      roleId: mockRoleId1,
      permissionId: mockPermissionId1,
      createdAt: new Date('2024-01-01'),
    },
    {
      roleId: mockRoleId1,
      permissionId: mockPermissionId2,
      createdAt: new Date('2024-01-01'),
    },
    {
      roleId: mockRoleId2,
      permissionId: mockPermissionId1,
      createdAt: new Date('2024-01-01'),
    },
  ] as RolePermission[];

  beforeEach(() => {
    mockRoleRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };

    mockRolePermissionRepository = {
      create: jest.fn(),
      findByRoleId: jest.fn(),
      findByPermissionId: jest.fn(),
      exists: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };

    mockPermissionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
    };

    useCase = new ListRolesUseCase(
      mockRoleRepository,
      mockRolePermissionRepository,
      mockPermissionRepository,
    );
  });

  describe('execute', () => {
    it('debería listar roles con sus permisos exitosamente', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue(mockRoles);
      mockRolePermissionRepository.findByRoleId
        .mockResolvedValueOnce([mockRolePermissions[0], mockRolePermissions[1]])
        .mockResolvedValueOnce([mockRolePermissions[2]]);
      mockPermissionRepository.findById
        .mockResolvedValueOnce(mockPermissions[0])
        .mockResolvedValueOnce(mockPermissions[1])
        .mockResolvedValueOnce(mockPermissions[0]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(mockRoleRepository.list).toHaveBeenCalled();
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledTimes(2);
      expect(mockPermissionRepository.findById).toHaveBeenCalledTimes(3);
      expect(result).toBeInstanceOf(ListRolesResponse);
      expect(result.roles).toHaveLength(2);
      expect(result.roles[0].id).toBe(mockRoleId1.value);
      expect(result.roles[0].name).toBe(RoleName.admin().value);
      expect(result.roles[0].permissions).toEqual(['create_task', 'edit_task']);
      expect(result.roles[1].id).toBe(mockRoleId2.value);
      expect(result.roles[1].name).toBe(RoleName.member().value);
      expect(result.roles[1].permissions).toEqual(['create_task']);
    });

    it('debería manejar roles sin permisos', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue(mockRoles);
      mockRolePermissionRepository.findByRoleId
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.roles).toHaveLength(2);
      expect(result.roles[0].permissions).toEqual([]);
      expect(result.roles[1].permissions).toEqual([]);
      expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
    });

    it('debería manejar permisos no encontrados', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue([mockRoles[0]]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([mockRolePermissions[0]]);
      mockPermissionRepository.findById.mockResolvedValue(null);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.roles).toHaveLength(1);
      expect(result.roles[0].permissions).toEqual([]);
    });

    it('debería manejar lista vacía de roles', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue([]);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.roles).toHaveLength(0);
      expect(mockRolePermissionRepository.findByRoleId).not.toHaveBeenCalled();
      expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda de roles falla', async () => {
      // Arrange
      mockRoleRepository.list.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Database error');
      expect(mockRoleRepository.list).toHaveBeenCalled();
      expect(mockRolePermissionRepository.findByRoleId).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda de permisos del rol falla', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue([mockRoles[0]]);
      mockRolePermissionRepository.findByRoleId.mockRejectedValue(
        new Error('Role permission error'),
      );

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Role permission error');
      expect(mockRoleRepository.list).toHaveBeenCalled();
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(mockRoleId1);
      expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda de permisos falla', async () => {
      // Arrange
      mockRoleRepository.list.mockResolvedValue([mockRoles[0]]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([mockRolePermissions[0]]);
      mockPermissionRepository.findById.mockRejectedValue(new Error('Permission error'));

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Permission error');
      expect(mockRoleRepository.list).toHaveBeenCalled();
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(mockRoleId1);
      expect(mockPermissionRepository.findById).toHaveBeenCalledWith(mockPermissionId1);
    });
  });
});
