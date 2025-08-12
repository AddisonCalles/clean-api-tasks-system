import { UserName } from './user-name.value-object';
import { UserNameInvalidException } from '../exceptions/user-name-invalid.exception';

describe('UserName', () => {
  describe('constructor', () => {
    it('should create UserName with valid value', () => {
      // Arrange
      const validName = 'John Doe';

      // Act
      const userName = new UserName(validName);

      // Assert
      expect(userName).toBeInstanceOf(UserName);
      expect(userName.value).toBe(validName);
    });

    it('should create UserName with minimum length', () => {
      // Arrange
      const validName = 'Jo';

      // Act
      const userName = new UserName(validName);

      // Assert
      expect(userName).toBeInstanceOf(UserName);
      expect(userName.value).toBe(validName);
    });

    it('should create UserName with maximum length', () => {
      // Arrange
      const validName = 'A'.repeat(100);

      // Act
      const userName = new UserName(validName);

      // Assert
      expect(userName).toBeInstanceOf(UserName);
      expect(userName.value).toBe(validName);
    });

    it('should trim whitespace from valid name', () => {
      // Arrange
      const nameWithSpaces = '  John Doe  ';
      const expectedName = 'John Doe';

      // Act
      const userName = new UserName(nameWithSpaces);

      // Assert
      expect(userName.value).toBe(expectedName);
    });

    it('should throw UserNameInvalidException when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new UserName('')).toThrow(UserNameInvalidException);
      expect(() => new UserName('')).toThrow('User name cannot be empty');
    });

    it('should throw UserNameInvalidException when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserName('   ')).toThrow(UserNameInvalidException);
      expect(() => new UserName('   ')).toThrow('User name cannot be empty');
    });

    it('should throw UserNameInvalidException when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new UserName(null as any)).toThrow(UserNameInvalidException);
      expect(() => new UserName(null as any)).toThrow(
        'User name cannot be empty',
      );
    });

    it('should throw UserNameInvalidException when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new UserName(undefined as any)).toThrow(
        UserNameInvalidException,
      );
      expect(() => new UserName(undefined as any)).toThrow(
        'User name cannot be empty',
      );
    });

    it('should throw UserNameInvalidException when value is too short', () => {
      // Arrange & Act & Assert
      expect(() => new UserName('J')).toThrow(UserNameInvalidException);
      expect(() => new UserName('J')).toThrow(
        'User name must be at least 2 characters long',
      );
    });

    it('should throw UserNameInvalidException when value is too long', () => {
      // Arrange
      const longName = 'A'.repeat(101);

      // Act & Assert
      expect(() => new UserName(longName)).toThrow(UserNameInvalidException);
      expect(() => new UserName(longName)).toThrow(
        'User name cannot exceed 100 characters',
      );
    });

    it('should handle names with special characters', () => {
      // Arrange
      const specialName = "José María O'Connor-Smith";

      // Act
      const userName = new UserName(specialName);

      // Assert
      expect(userName).toBeInstanceOf(UserName);
      expect(userName.value).toBe(specialName);
    });

    it('should handle names with numbers', () => {
      // Arrange
      const nameWithNumbers = 'John123 Doe';

      // Act
      const userName = new UserName(nameWithNumbers);

      // Assert
      expect(userName).toBeInstanceOf(UserName);
      expect(userName.value).toBe(nameWithNumbers);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validName = 'John Doe';
      const userName = new UserName(validName);

      // Act
      const result = userName.toString();

      // Assert
      expect(result).toBe(validName);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const name1 = new UserName('John Doe');
      const name2 = new UserName('John Doe');

      // Act & Assert
      expect(name1.equals(name2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const name1 = new UserName('John Doe');
      const name2 = new UserName('Jane Smith');

      // Act & Assert
      expect(name1.equals(name2)).toBe(false);
    });

    it('should be equal when values are the same but with different whitespace', () => {
      // Arrange
      const name1 = new UserName('John Doe');
      const name2 = new UserName('  John Doe  ');

      // Act & Assert
      expect(name1.equals(name2)).toBe(true);
    });
  });
});
