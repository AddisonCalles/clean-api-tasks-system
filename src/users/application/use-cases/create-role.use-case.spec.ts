import { CreateRoleUseCase } from './create-role.use-case';
import { RoleRepository } from '@users/domain/repositories';
import { CreateRoleRequest } from '@users/application/inputs/create-role.request.dto';
import { CreateRoleResponse } from '@users/application/outputs/create-role.response.dto';
import { Role } from '@users/domain/entities';
import { RoleName, RoleDescription, RoleId } from '@users/domain/value-objects';

describe('CreateRoleUseCase', () => {
  let useCase: CreateRoleUseCase;
  let mockRoleRepository: jest.Mocked<RoleRepository>;

  const mockRoleId = RoleId.generate();
  const mockRoleName = new RoleName('administrator');
  const mockRoleDescription = new RoleDescription('Admin role');

  const mockRole = {
    id: mockRoleId,
    name: mockRoleName,
    description: mockRoleDescription,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  } as Role;

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

    useCase = new CreateRoleUseCase(mockRoleRepository);
  });

  describe('execute', () => {
    it('debería crear un rol exitosamente', async () => {
      // Arrange
      const request: CreateRoleRequest = {
        name: 'administrator',
        description: 'Admin role',
      };
      mockRoleRepository.findByName.mockResolvedValue(null);
      mockRoleRepository.create.mockResolvedValue();

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(expect.any(RoleName));
      expect(mockRoleRepository.create).toHaveBeenCalledWith(expect.any(Role));
      expect(result).toBeInstanceOf(CreateRoleResponse);
      expect(result.name).toBe('administrator');
      expect(result.description).toBe('Admin role');
    });

    it('debería crear un rol sin descripción', async () => {
      // Arrange
      const request: CreateRoleRequest = {
        name: 'member',
      };
      mockRoleRepository.findByName.mockResolvedValue(null);
      mockRoleRepository.create.mockResolvedValue();

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(expect.any(RoleName));
      expect(mockRoleRepository.create).toHaveBeenCalledWith(expect.any(Role));
      expect(result).toBeInstanceOf(CreateRoleResponse);
      expect(result.name).toBe('member');
      expect(result.description).toBe(''); // Empty string for undefined description
    });

    it('debería lanzar error cuando el nombre del rol ya existe', async () => {
      // Arrange
      const request: CreateRoleRequest = {
        name: 'administrator',
        description: 'Admin role',
      };
      mockRoleRepository.findByName.mockResolvedValue(mockRole);

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Role name already exists');
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(expect.any(RoleName));
      expect(mockRoleRepository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda del rol falla', async () => {
      // Arrange
      const request: CreateRoleRequest = {
        name: 'administrator',
        description: 'Admin role',
      };
      mockRoleRepository.findByName.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Database error');
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(expect.any(RoleName));
      expect(mockRoleRepository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la creación del rol falla', async () => {
      // Arrange
      const request: CreateRoleRequest = {
        name: 'administrator',
        description: 'Admin role',
      };
      mockRoleRepository.findByName.mockResolvedValue(null);
      mockRoleRepository.create.mockRejectedValue(new Error('Creation error'));

      // Act & Assert
      await expect(useCase.execute(request)).rejects.toThrow('Creation error');
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith(expect.any(RoleName));
      expect(mockRoleRepository.create).toHaveBeenCalledWith(expect.any(Role));
    });
  });
});
