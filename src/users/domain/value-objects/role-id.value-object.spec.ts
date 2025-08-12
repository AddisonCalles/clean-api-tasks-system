import { RoleId } from './role-id.value-object';

describe('RoleId', () => {
  describe('constructor', () => {
    it('should create RoleId with valid value', () => {
      // Arrange
      const validId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const roleId = new RoleId(validId);

      // Assert
      expect(roleId).toBeInstanceOf(RoleId);
      expect(roleId.value).toBe(validId);
    });

    it('should throw error when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new RoleId('')).toThrow('Role ID cannot be empty');
    });

    it('should throw error when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new RoleId('   ')).toThrow('Role ID cannot be empty');
    });

    it('should throw error when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new RoleId(null as any)).toThrow('Role ID cannot be empty');
    });

    it('should throw error when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new RoleId(undefined as any)).toThrow(
        'Role ID cannot be empty',
      );
    });
  });

  describe('generate', () => {
    it('should generate a new RoleId with UUID', () => {
      // Act
      const roleId = RoleId.generate();

      // Assert
      expect(roleId).toBeInstanceOf(RoleId);
      expect(roleId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate different UUIDs on multiple calls', () => {
      // Act
      const roleId1 = RoleId.generate();
      const roleId2 = RoleId.generate();

      // Assert
      expect(roleId1.value).not.toBe(roleId2.value);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validId = '123e4567-e89b-12d3-a456-426614174000';
      const roleId = new RoleId(validId);

      // Act
      const result = roleId.toString();

      // Assert
      expect(result).toBe(validId);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const id1 = new RoleId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new RoleId('123e4567-e89b-12d3-a456-426614174000');

      // Act & Assert
      expect(id1.equals(id2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const id1 = new RoleId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new RoleId('987fcdeb-51a2-43d1-b789-987654321000');

      // Act & Assert
      expect(id1.equals(id2)).toBe(false);
    });
  });
});
