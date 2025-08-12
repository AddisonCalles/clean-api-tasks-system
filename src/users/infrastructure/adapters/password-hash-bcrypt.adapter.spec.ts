import { Test, TestingModule } from '@nestjs/testing';
import { PasswordHashBcryptAdapter } from './password-hash-bcrypt.adapter';
import { UserPassword, PasswordHash } from '@users/domain/value-objects';
import * as bcryptMock from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('PasswordHashBcryptAdapter', () => {
  let adapter: PasswordHashBcryptAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordHashBcryptAdapter],
    }).compile();

    adapter = module.get<PasswordHashBcryptAdapter>(PasswordHashBcryptAdapter);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create adapter with default salt rounds', () => {
      const adapterWithDefaults = new PasswordHashBcryptAdapter();
      expect(adapterWithDefaults).toBeInstanceOf(PasswordHashBcryptAdapter);
    });

    it('should create adapter with custom salt rounds', () => {
      const customSaltRounds = 12;
      const adapterWithCustom = new PasswordHashBcryptAdapter(customSaltRounds);
      expect(adapterWithCustom).toBeInstanceOf(PasswordHashBcryptAdapter);
    });
  });

  describe('hash', () => {
    it('should hash password successfully', async () => {
      // Arrange
      const passwordValue = 'testPassword123';
      const password = new UserPassword(passwordValue);
      const expectedHash = '$2b$10$hashedPasswordString';
      bcryptMock.hash.mockImplementation(() => {
        return expectedHash;
      });

      // Act
      const result = await adapter.hash(password);

      // Assert
      expect(bcryptMock.hash).toHaveBeenCalledWith(passwordValue, 10);
      expect(result).toBeInstanceOf(PasswordHash);
      expect(result.value).toBe(expectedHash);
    });

    it('should hash password with custom salt rounds', async () => {
      // Arrange
      const customSaltRounds = 12;
      const customAdapter = new PasswordHashBcryptAdapter(customSaltRounds);
      const passwordValue = 'testPassword123';
      const password = new UserPassword(passwordValue);
      const expectedHash = '$2b$12$hashedPasswordString';

      bcryptMock.hash.mockImplementation(() => {
        return expectedHash;
      });

      // Act
      const result = await customAdapter.hash(password);

      // Assert
      expect(bcryptMock.hash).toHaveBeenCalledWith(
        passwordValue,
        customSaltRounds,
      );
      expect(result).toBeInstanceOf(PasswordHash);
      expect(result.value).toBe(expectedHash);
    });

    it('should hash password with special characters', async () => {
      // Arrange
      const passwordValue = 'Test@Password#123!';
      const password = new UserPassword(passwordValue);
      const expectedHash = '$2b$10$hashedSpecialPassword';

      bcryptMock.hash.mockImplementation(() => {
        return expectedHash;
      });

      // Act
      const result = await adapter.hash(password);

      // Assert
      expect(bcryptMock.hash).toHaveBeenCalledWith(passwordValue, 10);
      expect(result).toBeInstanceOf(PasswordHash);
      expect(result.value).toBe(expectedHash);
    });
  });

  describe('compare', () => {
    it('should return true when password matches hash', async () => {
      // Arrange
      const passwordValue = 'testPassword123';
      const password = new UserPassword(passwordValue);
      const hashValue = '$2b$10$hashedPasswordString';
      const hash = new PasswordHash(hashValue);

      bcryptMock.compare.mockImplementation(() => {
        return true;
      });

      // Act
      const result = await adapter.compare(password, hash);

      // Assert
      expect(bcryptMock.compare).toHaveBeenCalledWith(passwordValue, hashValue);
      expect(result).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      // Arrange
      const passwordValue = 'testPassword123';
      const password = new UserPassword(passwordValue);
      const hashValue = '$2b$10$hashedPasswordString';
      const hash = new PasswordHash(hashValue);

      bcryptMock.compare.mockImplementation(() => {
        return false;
      });

      // Act
      const result = await adapter.compare(password, hash);

      // Assert
      expect(bcryptMock.compare).toHaveBeenCalledWith(passwordValue, hashValue);
      expect(result).toBe(false);
    });

    it('should compare password with empty hash', async () => {
      // Arrange
      const passwordValue = 'testPassword123';
      const password = new UserPassword(passwordValue);
      const hashValue = '';
      const hash = new PasswordHash(hashValue);

      bcryptMock.compare.mockImplementation(() => {
        return false;
      });

      // Act
      const result = await adapter.compare(password, hash);

      // Assert
      expect(bcryptMock.compare).toHaveBeenCalledWith(passwordValue, hashValue);
      expect(result).toBe(false);
    });

    it('should compare password with special characters against hash', async () => {
      // Arrange
      const passwordValue = 'Test@Password#123!';
      const password = new UserPassword(passwordValue);
      const hashValue = '$2b$10$hashedSpecialPassword';
      const hash = new PasswordHash(hashValue);

      bcryptMock.compare.mockImplementation(() => {
        return true;
      });

      // Act
      const result = await adapter.compare(password, hash);

      // Assert
      expect(bcryptMock.compare).toHaveBeenCalledWith(passwordValue, hashValue);
      expect(result).toBe(true);
    });
  });
});
