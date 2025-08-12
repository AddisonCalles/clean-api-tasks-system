import { UserPassword } from './user-password.value-object';
import { UserPasswordInvalidException } from '../exceptions/user-password-invalid.exception';

describe('UserPassword', () => {
  describe('constructor', () => {
    it('should create UserPassword with valid password', () => {
      // Arrange
      const validPassword = 'SecurePass123!';

      // Act
      const userPassword = new UserPassword(validPassword);

      // Assert
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.value).toBe(validPassword);
    });

    it('should create UserPassword with minimum length', () => {
      // Arrange
      const validPassword = '12345678';

      // Act
      const userPassword = new UserPassword(validPassword);

      // Assert
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.value).toBe(validPassword);
    });

    it('should create UserPassword with maximum length', () => {
      // Arrange
      const validPassword = 'A'.repeat(255);

      // Act
      const userPassword = new UserPassword(validPassword);

      // Assert
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.value).toBe(validPassword);
    });

    it('should handle passwords with special characters', () => {
      // Arrange
      const specialPassword = 'P@ssw0rd!@#$%^&*()';

      // Act
      const userPassword = new UserPassword(specialPassword);

      // Assert
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.value).toBe(specialPassword);
    });

    it('should handle passwords with spaces', () => {
      // Arrange
      const passwordWithSpaces = 'My Password 123';

      // Act
      const userPassword = new UserPassword(passwordWithSpaces);

      // Assert
      expect(userPassword).toBeInstanceOf(UserPassword);
      expect(userPassword.value).toBe(passwordWithSpaces);
    });

    it('should throw UserPasswordInvalidException when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new UserPassword('')).toThrow(UserPasswordInvalidException);
      expect(() => new UserPassword('')).toThrow(
        'User password cannot be empty',
      );
    });

    it('should throw UserPasswordInvalidException when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new UserPassword(null as any)).toThrow(
        UserPasswordInvalidException,
      );
      expect(() => new UserPassword(null as any)).toThrow(
        'User password cannot be empty',
      );
    });

    it('should throw UserPasswordInvalidException when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new UserPassword(undefined as any)).toThrow(
        UserPasswordInvalidException,
      );
      expect(() => new UserPassword(undefined as any)).toThrow(
        'User password cannot be empty',
      );
    });

    it('should throw UserPasswordInvalidException when password is too short', () => {
      // Arrange & Act & Assert
      expect(() => new UserPassword('1234567')).toThrow(
        UserPasswordInvalidException,
      );
      expect(() => new UserPassword('1234567')).toThrow(
        'User password must be at least 8 characters long',
      );
    });

    it('should throw UserPasswordInvalidException when password is too long', () => {
      // Arrange
      const longPassword = 'A'.repeat(256);

      // Act & Assert
      expect(() => new UserPassword(longPassword)).toThrow(
        UserPasswordInvalidException,
      );
      expect(() => new UserPassword(longPassword)).toThrow(
        'User password cannot exceed 255 characters',
      );
    });

    it('should accept various valid password formats', () => {
      // Arrange
      const validPasswords = [
        'password123',
        'PASSWORD123',
        'Password123',
        'p@ssw0rd',
        'MySecurePassword123!',
        '1234567890',
        'abcdefgh',
        'ABCDEFGH',
        '!@#$%^&*()',
        'Pass Word 123',
      ];

      // Act & Assert
      validPasswords.forEach((password) => {
        expect(() => new UserPassword(password)).not.toThrow();
      });
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validPassword = 'SecurePass123!';
      const userPassword = new UserPassword(validPassword);

      // Act
      const result = userPassword.toString();

      // Assert
      expect(result).toBe(validPassword);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const password1 = new UserPassword('SecurePass123!');
      const password2 = new UserPassword('SecurePass123!');

      // Act & Assert
      expect(password1.equals(password2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const password1 = new UserPassword('SecurePass123!');
      const password2 = new UserPassword('DifferentPass456!');

      // Act & Assert
      expect(password1.equals(password2)).toBe(false);
    });

    it('should not be equal when values are similar but different', () => {
      // Arrange
      const password1 = new UserPassword('SecurePass123!');
      const password2 = new UserPassword('SecurePass123');

      // Act & Assert
      expect(password1.equals(password2)).toBe(false);
    });
  });
});
