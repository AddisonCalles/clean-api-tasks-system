import { RoleDescription } from './role-description.value-object';

describe('RoleDescription', () => {
  describe('constructor', () => {
    it('should create RoleDescription with valid value', () => {
      // Arrange
      const validDescription = 'Administrator role with full access';

      // Act
      const roleDescription = new RoleDescription(validDescription);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(validDescription);
    });

    it('should create RoleDescription with empty string', () => {
      // Arrange
      const emptyDescription = '';

      // Act
      const roleDescription = new RoleDescription(emptyDescription);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(emptyDescription);
    });

    it('should create RoleDescription with whitespace only', () => {
      // Arrange
      const whitespaceDescription = '   ';

      // Act
      const roleDescription = new RoleDescription(whitespaceDescription);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(whitespaceDescription);
    });

    it('should handle descriptions with special characters', () => {
      // Arrange
      const specialDescription = 'Role with special chars: @#$%^&*()!';

      // Act
      const roleDescription = new RoleDescription(specialDescription);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(specialDescription);
    });

    it('should handle descriptions with numbers', () => {
      // Arrange
      const descriptionWithNumbers = 'Role 123 with numbers 456';

      // Act
      const roleDescription = new RoleDescription(descriptionWithNumbers);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(descriptionWithNumbers);
    });

    it('should handle long descriptions', () => {
      // Arrange
      const longDescription = 'A'.repeat(500);

      // Act
      const roleDescription = new RoleDescription(longDescription);

      // Assert
      expect(roleDescription).toBeInstanceOf(RoleDescription);
      expect(roleDescription.value).toBe(longDescription);
    });

    it('should throw an error if the description is too long', () => {
      // Arrange
      const longDescription = 'A'.repeat(501);

      // Act & Assert
      expect(() => new RoleDescription(longDescription)).toThrow(
        'Role description cannot exceed 500 characters',
      );
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validDescription = 'Administrator role with full access';
      const roleDescription = new RoleDescription(validDescription);

      // Act
      const result = roleDescription.toString();

      // Assert
      expect(result).toBe(validDescription);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const desc1 = new RoleDescription('Administrator role');
      const desc2 = new RoleDescription('Administrator role');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const desc1 = new RoleDescription('Administrator role');
      const desc2 = new RoleDescription('Member role');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should not be equal when values are similar but different', () => {
      // Arrange
      const desc1 = new RoleDescription('Administrator role');
      const desc2 = new RoleDescription('Administrator roles');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should be equal when both are empty strings', () => {
      // Arrange
      const desc1 = new RoleDescription('');
      const desc2 = new RoleDescription('');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true);
    });
  });
});
