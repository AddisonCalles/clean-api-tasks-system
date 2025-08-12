import { UserEmail } from './user-email.value-object';
import { UserEmailInvalidException } from '../exceptions/user-email-invalid.exception';

describe('UserEmail', () => {
  describe('constructor', () => {
    it('should create UserEmail with valid email', () => {
      // Arrange
      const validEmail = 'john.doe@example.com';

      // Act
      const userEmail = new UserEmail(validEmail);

      // Assert
      expect(userEmail).toBeInstanceOf(UserEmail);
      expect(userEmail.value).toBe(validEmail);
    });

    it('should create UserEmail with uppercase email and convert to lowercase', () => {
      // Arrange
      const uppercaseEmail = 'JOHN.DOE@EXAMPLE.COM';
      const expectedEmail = 'john.doe@example.com';

      // Act
      const userEmail = new UserEmail(uppercaseEmail);

      // Assert
      expect(userEmail).toBeInstanceOf(UserEmail);
      expect(userEmail.value).toBe(expectedEmail);
    });

    it('should create UserEmail with mixed case email and convert to lowercase', () => {
      // Arrange
      const mixedEmail = 'John.Doe@Example.COM';
      const expectedEmail = 'john.doe@example.com';

      // Act
      const userEmail = new UserEmail(mixedEmail);

      // Assert
      expect(userEmail).toBeInstanceOf(UserEmail);
      expect(userEmail.value).toBe(expectedEmail);
    });

    it('should trim whitespace from valid email', () => {
      // Arrange
      const emailWithSpaces = '  john.doe@example.com  ';
      const expectedEmail = 'john.doe@example.com';

      // Act
      const userEmail = new UserEmail(emailWithSpaces);

      // Assert
      expect(userEmail.value).toBe(expectedEmail);
    });

    it('should handle email with maximum length', () => {
      // Arrange
      const longEmail = 'a'.repeat(246) + '@23456.89';

      // Act
      const userEmail = new UserEmail(longEmail);

      // Assert
      expect(userEmail).toBeInstanceOf(UserEmail);
      expect(userEmail.value).toBe(longEmail.toLowerCase());
    });

    it('should throw UserEmailInvalidException when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('')).toThrow(UserEmailInvalidException);
      expect(() => new UserEmail('')).toThrow('User email cannot be empty');
    });

    it('should throw UserEmailInvalidException when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('   ')).toThrow(UserEmailInvalidException);
      expect(() => new UserEmail('   ')).toThrow('User email cannot be empty');
    });

    it('should throw UserEmailInvalidException when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail(null as any)).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail(null as any)).toThrow(
        'User email cannot be empty',
      );
    });

    it('should throw UserEmailInvalidException when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail(undefined as any)).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail(undefined as any)).toThrow(
        'User email cannot be empty',
      );
    });

    it('should throw UserEmailInvalidException when email is too long', () => {
      // Arrange
      const longEmail = 'a'.repeat(247) + '@23456.89';

      // Act & Assert
      expect(() => new UserEmail(longEmail)).toThrow(UserEmailInvalidException);
      expect(() => new UserEmail(longEmail)).toThrow(
        'User email cannot exceed 255 characters',
      );
    });

    it('should throw UserEmailInvalidException when email format is invalid - missing @', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('john.doeexample.com')).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail('john.doeexample.com')).toThrow(
        'User email must be a valid email address',
      );
    });

    it('should throw UserEmailInvalidException when email format is invalid - missing domain', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('john.doe@')).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail('john.doe@')).toThrow(
        'User email must be a valid email address',
      );
    });

    it('should throw UserEmailInvalidException when email format is invalid - missing local part', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('@example.com')).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail('@example.com')).toThrow(
        'User email must be a valid email address',
      );
    });

    it('should throw UserEmailInvalidException when email format is invalid - multiple @', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('john@doe@example.com')).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail('john@doe@example.com')).toThrow(
        'User email must be a valid email address',
      );
    });

    it('should throw UserEmailInvalidException when email format is invalid - spaces', () => {
      // Arrange & Act & Assert
      expect(() => new UserEmail('john doe@example.com')).toThrow(
        UserEmailInvalidException,
      );
      expect(() => new UserEmail('john doe@example.com')).toThrow(
        'User email must be a valid email address',
      );
    });

    it('should accept valid email formats', () => {
      // Arrange
      const validEmails = [
        'john.doe@example.com',
        'jane+tag@example.co.uk',
        'user123@subdomain.example.org',
        'test.email@domain-name.com',
        'simple@example.com',
        'very.common@example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-dash@example.com',
      ];

      // Act & Assert
      validEmails.forEach((email) => {
        expect(() => new UserEmail(email)).not.toThrow();
      });
    });
  });

  describe('toString', () => {
    it('should return the value as lowercase string', () => {
      // Arrange
      const validEmail = 'John.Doe@EXAMPLE.COM';
      const expectedEmail = 'john.doe@example.com';
      const userEmail = new UserEmail(validEmail);

      // Act
      const result = userEmail.toString();

      // Assert
      expect(result).toBe(expectedEmail);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const email1 = new UserEmail('john.doe@example.com');
      const email2 = new UserEmail('john.doe@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const email1 = new UserEmail('john.doe@example.com');
      const email2 = new UserEmail('jane.smith@example.com');

      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });

    it('should be equal when values are the same but with different case', () => {
      // Arrange
      const email1 = new UserEmail('john.doe@example.com');
      const email2 = new UserEmail('JOHN.DOE@EXAMPLE.COM');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should be equal when values are the same but with different whitespace', () => {
      // Arrange
      const email1 = new UserEmail('john.doe@example.com');
      const email2 = new UserEmail('  john.doe@example.com  ');

      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });
  });
});
