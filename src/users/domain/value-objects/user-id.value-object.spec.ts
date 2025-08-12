import { UserId } from './user-id.value-object';

describe('UserId', () => {
  describe('constructor', () => {
    it('should create UserId with valid value', () => {
      // Arrange
      const validId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const userId = new UserId(validId);

      // Assert
      expect(userId).toBeInstanceOf(UserId);
      expect(userId.value).toBe(validId);
    });

    it('should throw error when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new UserId('')).toThrow('User ID cannot be empty');
    });

    it('should throw error when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserId('   ')).toThrow('User ID cannot be empty');
    });

    it('should throw error when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new UserId(null as any)).toThrow('User ID cannot be empty');
    });

    it('should throw error when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new UserId(undefined as any)).toThrow(
        'User ID cannot be empty',
      );
    });
  });

  describe('generate', () => {
    it('should generate a new UserId with UUID', () => {
      // Act
      const userId = UserId.generate();

      // Assert
      expect(userId).toBeInstanceOf(UserId);
      expect(userId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate different UUIDs on multiple calls', () => {
      // Act
      const userId1 = UserId.generate();
      const userId2 = UserId.generate();

      // Assert
      expect(userId1.value).not.toBe(userId2.value);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const userId = new UserId(validId);

      // Act
      const result = userId.toString();

      // Assert
      expect(result).toBe(validId);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const id1 = new UserId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new UserId('123e4567-e89b-12d3-a456-426614174000');

      // Act & Assert
      expect(id1.equals(id2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const id1 = new UserId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new UserId('987fcdeb-51a2-43d1-b789-987654321000');

      // Act & Assert
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
