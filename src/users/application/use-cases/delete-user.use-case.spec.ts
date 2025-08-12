import { DeleteUserUseCase } from './delete-user.use-case';
import { UserRepository } from '@users/domain/repositories';
import { UserId } from '@users/domain/value-objects';
import { UserNotFoundException } from '@users/domain/exceptions';
import { User } from '@users/domain/entities';
import { UserName, UserEmail, RoleId } from '@users/domain/value-objects';
import { PasswordHash } from '@users/domain/value-objects';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUserId = UserId.generate();
  const mockRoleId = RoleId.generate();

  const mockUser = {
    id: mockUserId,
    name: new UserName('John Doe'),
    email: new UserEmail('john@example.com'),
    password: new PasswordHash('hashed-password-123'),
    roleId: mockRoleId,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    markAsDeleted: jest.fn(),
  } as unknown as User;

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

    useCase = new DeleteUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue();

      // Act
      await useCase.execute(mockUserId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.markAsDeleted).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });

    it('debería lanzar UserNotFoundException cuando el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow(UserNotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la búsqueda del usuario falla', async () => {
      // Arrange
      mockUserRepository.findById.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow('Database error');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('debería lanzar error cuando la actualización del usuario falla', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockRejectedValue(new Error('Update error'));

      // Act & Assert
      await expect(useCase.execute(mockUserId)).rejects.toThrow('Update error');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUser.markAsDeleted).toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
