import { PermissionDescription } from './permission-description.value-object';

describe('PermissionDescription', () => {
  describe('constructor', () => {
    it('should create PermissionDescription with valid value', () => {
      // Arrange
      const validDescription = 'Permission to read user data';

      // Act
      const permissionDescription = new PermissionDescription(validDescription);

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(validDescription);
    });

    it('should create PermissionDescription with empty string', () => {
      // Arrange
      const emptyDescription = '';

      // Act
      const permissionDescription = new PermissionDescription(emptyDescription);

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(emptyDescription);
    });

    it('should create PermissionDescription with whitespace only', () => {
      // Arrange
      const whitespaceDescription = '   ';

      // Act
      const permissionDescription = new PermissionDescription(
        whitespaceDescription,
      );

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(whitespaceDescription);
    });

    it('should handle descriptions with special characters', () => {
      // Arrange
      const specialDescription = 'Permission with special chars: @#$%^&*()!';

      // Act
      const permissionDescription = new PermissionDescription(
        specialDescription,
      );

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(specialDescription);
    });

    it('should handle descriptions with numbers', () => {
      // Arrange
      const descriptionWithNumbers = 'Permission 123 with numbers 456';

      // Act
      const permissionDescription = new PermissionDescription(
        descriptionWithNumbers,
      );

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(descriptionWithNumbers);
    });

    it('should handle long descriptions', () => {
      // Arrange
      const longDescription = 'A'.repeat(500);

      // Act
      const permissionDescription = new PermissionDescription(longDescription);

      // Assert
      expect(permissionDescription).toBeInstanceOf(PermissionDescription);
      expect(permissionDescription.value).toBe(longDescription);
    });

    it('should throw an error if the description is too long', () => {
      // Arrange
      const longDescription = 'A'.repeat(501);

      // Act & Assert
      expect(() => new PermissionDescription(longDescription)).toThrow(
        'Permission description cannot exceed 500 characters',
      );
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validDescription = 'Permission to read user data';
      const permissionDescription = new PermissionDescription(validDescription);

      // Act
      const result = permissionDescription.toString();

      // Assert
      expect(result).toBe(validDescription);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const desc1 = new PermissionDescription('Read permission');
      const desc2 = new PermissionDescription('Read permission');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const desc1 = new PermissionDescription('Read permission');
      const desc2 = new PermissionDescription('Write permission');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should not be equal when values are similar but different', () => {
      // Arrange
      const desc1 = new PermissionDescription('Read permission');
      const desc2 = new PermissionDescription('Read permissions');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(false);
    });

    it('should be equal when both are empty strings', () => {
      // Arrange
      const desc1 = new PermissionDescription('');
      const desc2 = new PermissionDescription('');

      // Act & Assert
      expect(desc1.equals(desc2)).toBe(true);
    });
  });
});
