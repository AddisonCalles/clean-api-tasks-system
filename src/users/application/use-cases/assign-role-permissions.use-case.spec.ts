/* eslint-disable @typescript-eslint/unbound-method */
import { AssignRolePermissionsUseCase } from './assign-role-permissions.use-case';
import {
  RoleRepository,
  PermissionRepository,
  RolePermissionRepository,
} from '@users/domain/repositories';
import { AssignRolePermissionsRequest } from '@users/application/inputs/assign-role-permissions.request.dto';
import { Role, Permission, RolePermission } from '@users/domain/entities';
import {
  RoleId,
  PermissionId,
  RoleName,
  RoleDescription,
} from '@users/domain/value-objects';
import {
  RoleNotFoundException,
  PermissionNotFoundException,
} from '@users/domain/exceptions';
import { ValidationException } from '@shared/domain/exceptions';

describe('AssignRolePermissionsUseCase', () => {
  let useCase: AssignRolePermissionsUseCase;
  let mockRoleRepository: jest.Mocked<RoleRepository>;
  let mockPermissionRepository: jest.Mocked<PermissionRepository>;
  let mockRolePermissionRepository: jest.Mocked<RolePermissionRepository>;

  const mockRoleId = RoleId.generate();
  const mockPermissionId1 = PermissionId.generate();
  const mockPermissionId2 = PermissionId.generate();

  const mockRole = {
    id: mockRoleId,
    name: RoleName.admin(),
    description: new RoleDescription('Admin role'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as Role;

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
      roleId: mockRoleId,
      permissionId: mockPermissionId1,
      createdAt: new Date('2024-01-01'),
    },
    {
      roleId: mockRoleId,
      permissionId: mockPermissionId2,
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
    };

    mockPermissionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
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

    useCase = new AssignRolePermissionsUseCase(
      mockRoleRepository,
      mockPermissionRepository,
      mockRolePermissionRepository,
    );
  });

  describe('execute', () => {
    it('debería asignar permisos a un rol exitosamente', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value, mockPermissionId2.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById
        .mockResolvedValueOnce(mockPermissions[0])
        .mockResolvedValueOnce(mockPermissions[1]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([]);
      mockRolePermissionRepository.create.mockResolvedValue();

      // Act
      await useCase.execute(request);

      // Assert
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
      expect(mockPermissionRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(
        mockRoleId,
      );
      expect(mockRolePermissionRepository.create).toHaveBeenCalledTimes(2);
    });

    it('debería eliminar permisos existentes antes de asignar nuevos', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById.mockResolvedValue(mockPermissions[0]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([
        mockRolePermissions[0],
      ]);
      mockRolePermissionRepository.delete.mockResolvedValue();
      mockRolePermissionRepository.create.mockResolvedValue();

      // Act
      await useCase.execute(request);

      // Assert
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(
        mockRoleId,
      );
      expect(mockRolePermissionRepository.delete).toHaveBeenCalledWith(
        mockRoleId,
        mockPermissionId1,
      );
      expect(mockRolePermissionRepository.create).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar RoleNotFoundException cuando el rol no existe', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: 'nonexistent-role',
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        ValidationException,
      );
      expect(mockRoleRepository.findById).not.toHaveBeenCalled();
      expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar PermissionNotFoundException cuando un permiso no existe', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value, mockPermissionId2.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById
        .mockResolvedValueOnce(mockPermissions[0])
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        PermissionNotFoundException,
      );
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
      expect(mockPermissionRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockRolePermissionRepository.findByRoleId).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda del rol falla', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Database error');
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
      expect(mockPermissionRepository.findById).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda de permisos falla', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById.mockRejectedValue(
        new Error('Permission database error'),
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow(
        'Permission database error',
      );
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(mockRoleId);
      expect(mockPermissionRepository.findById).toHaveBeenCalledWith(
        mockPermissionId1,
      );
    });

    it('debería lanzar error cuando la eliminación de permisos existentes falla', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById.mockResolvedValue(mockPermissions[0]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([
        mockRolePermissions[0],
      ]);
      mockRolePermissionRepository.delete.mockRejectedValue(
        new Error('Delete error'),
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Delete error');
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(
        mockRoleId,
      );
      expect(mockRolePermissionRepository.delete).toHaveBeenCalledWith(
        mockRoleId,
        mockPermissionId1,
      );
    });

    it('debería lanzar error cuando la creación de nuevos permisos falla', async () => {
      // Arrange
      const request: AssignRolePermissionsRequest = {
        roleId: mockRoleId.value,
        permissionIds: [mockPermissionId1.value],
      };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockPermissionRepository.findById.mockResolvedValue(mockPermissions[0]);
      mockRolePermissionRepository.findByRoleId.mockResolvedValue([]);
      mockRolePermissionRepository.create.mockRejectedValue(
        new Error('Create error'),
      );

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Create error');
      expect(mockRolePermissionRepository.findByRoleId).toHaveBeenCalledWith(
        mockRoleId,
      );
      expect(mockRolePermissionRepository.create).toHaveBeenCalledWith(
        expect.any(RolePermission),
      );
    });
  });
});
