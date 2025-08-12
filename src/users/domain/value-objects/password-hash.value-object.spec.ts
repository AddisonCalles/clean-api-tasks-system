import { PasswordHash } from './password-hash.value-object';

describe('PasswordHash', () => {
  describe('constructor', () => {
    it('should create PasswordHash with valid value', () => {
      // Arrange
      const validHash = '$2b$10$hashedPasswordString';

      // Act
      const passwordHash = new PasswordHash(validHash);

      // Assert
      expect(passwordHash).toBeInstanceOf(PasswordHash);
      expect(passwordHash.value).toBe(validHash);
    });

    it('should create PasswordHash with empty string', () => {
      // Arrange
      const emptyHash = '';

      // Act
      const passwordHash = new PasswordHash(emptyHash);

      // Assert
      expect(passwordHash).toBeInstanceOf(PasswordHash);
      expect(passwordHash.value).toBe(emptyHash);
    });

    it('should handle hash with special characters', () => {
      // Arrange
      const specialHash = '$2b$10$hash.with.special.chars!@#';

      // Act
      const passwordHash = new PasswordHash(specialHash);

      // Assert
      expect(passwordHash).toBeInstanceOf(PasswordHash);
      expect(passwordHash.value).toBe(specialHash);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validHash = '$2b$10$hashedPasswordString';
      const passwordHash = new PasswordHash(validHash);

      // Act
      const result = passwordHash.toString();

      // Assert
      expect(result).toBe(validHash);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const hash1 = new PasswordHash('$2b$10$hash1');
      const hash2 = new PasswordHash('$2b$10$hash1');

      // Act & Assert
      expect(hash1.equals(hash2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const hash1 = new PasswordHash('$2b$10$hash1');
      const hash2 = new PasswordHash('$2b$10$hash2');

      // Act & Assert
      expect(hash1.equals(hash2)).toBe(false);
    });
  });
});
