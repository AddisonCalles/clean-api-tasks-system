import { UserFilter, UserFilterOptions } from './user-filter.value-object';
import { UserFilterInvalidException } from '../exceptions/user-filter-invalid.exception';

describe('UserFilter', () => {
  describe('constructor', () => {
    it('should create UserFilter with empty options', () => {
      // Arrange
      const emptyOptions: UserFilterOptions = {};

      // Act
      const userFilter = new UserFilter(emptyOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(emptyOptions);
    });

    it('should create UserFilter with valid name filter', () => {
      // Arrange
      const validOptions: UserFilterOptions = { name: 'John' };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should create UserFilter with valid email filter', () => {
      // Arrange
      const validOptions: UserFilterOptions = { email: 'john@example.com' };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should create UserFilter with valid role filter', () => {
      // Arrange
      const validOptions: UserFilterOptions = { roleName: 'administrator' };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should create UserFilter with valid limit', () => {
      // Arrange
      const validOptions: UserFilterOptions = { limit: 50 };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should create UserFilter with valid offset', () => {
      // Arrange
      const validOptions: UserFilterOptions = { offset: 20 };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should create UserFilter with all valid options', () => {
      // Arrange
      const validOptions: UserFilterOptions = {
        name: 'John',
        email: 'john@example.com',
        roleName: 'administrator',
        limit: 25,
        offset: 10,
      };

      // Act
      const userFilter = new UserFilter(validOptions);

      // Assert
      expect(userFilter).toBeInstanceOf(UserFilter);
      expect(userFilter.value).toEqual(validOptions);
    });

    it('should throw UserFilterInvalidException when limit is less than 1', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ limit: 0 })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ limit: 0 })).toThrow(
        'Limit must be between 1 and 100',
      );
    });

    it('should throw UserFilterInvalidException when limit is greater than 100', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ limit: 101 })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ limit: 101 })).toThrow(
        'Limit must be between 1 and 100',
      );
    });

    it('should throw UserFilterInvalidException when offset is negative', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ offset: -1 })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ offset: -1 })).toThrow(
        'Offset must be non-negative',
      );
    });

    it('should throw UserFilterInvalidException when name is empty string', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ name: '' }));
    });

    it('should throw UserFilterInvalidException when name is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ name: '   ' })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ name: '   ' })).toThrow(
        'Name filter cannot be empty string',
      );
    });

    it('should throw UserFilterInvalidException when email is empty string', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ email: '' }));
    });

    it('should throw UserFilterInvalidException when email is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ email: '   ' })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ email: '   ' })).toThrow(
        'Email filter cannot be empty string',
      );
    });

    it('should throw UserFilterInvalidException when roleName is empty string', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ roleName: '' }));
    });

    it('should throw UserFilterInvalidException when roleName is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new UserFilter({ roleName: '   ' })).toThrow(
        UserFilterInvalidException,
      );
      expect(() => new UserFilter({ roleName: '   ' })).toThrow(
        'Role name filter cannot be empty string',
      );
    });
  });

  describe('hasNameFilter', () => {
    it('should return true when name filter is present', () => {
      // Arrange
      const userFilter = new UserFilter({ name: 'John' });

      // Act & Assert
      expect(userFilter.hasNameFilter()).toBe(true);
    });

    it('should return false when name filter is not present', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.hasNameFilter()).toBe(false);
    });

    it('should return false when name filter is undefined', () => {
      // Arrange
      const userFilter = new UserFilter({ name: undefined });

      // Act & Assert
      expect(userFilter.hasNameFilter()).toBe(false);
    });
  });

  describe('hasEmailFilter', () => {
    it('should return true when email filter is present', () => {
      // Arrange
      const userFilter = new UserFilter({ email: 'john@example.com' });

      // Act & Assert
      expect(userFilter.hasEmailFilter()).toBe(true);
    });

    it('should return false when email filter is not present', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.hasEmailFilter()).toBe(false);
    });

    it('should return false when email filter is undefined', () => {
      // Arrange
      const userFilter = new UserFilter({ email: undefined });

      // Act & Assert
      expect(userFilter.hasEmailFilter()).toBe(false);
    });
  });

  describe('hasRoleFilter', () => {
    it('should return true when role filter is present', () => {
      // Arrange
      const userFilter = new UserFilter({ roleName: 'administrator' });

      // Act & Assert
      expect(userFilter.hasRoleFilter()).toBe(true);
    });

    it('should return false when role filter is not present', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.hasRoleFilter()).toBe(false);
    });

    it('should return false when role filter is undefined', () => {
      // Arrange
      const userFilter = new UserFilter({ roleName: undefined });

      // Act & Assert
      expect(userFilter.hasRoleFilter()).toBe(false);
    });
  });

  describe('getLimit', () => {
    it('should return the limit when provided', () => {
      // Arrange
      const userFilter = new UserFilter({ limit: 25 });

      // Act & Assert
      expect(userFilter.getLimit()).toBe(25);
    });

    it('should return default limit of 10 when not provided', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.getLimit()).toBe(10);
    });

    it('should return default limit of 10 when limit is undefined', () => {
      // Arrange
      const userFilter = new UserFilter({ limit: undefined });

      // Act & Assert
      expect(userFilter.getLimit()).toBe(10);
    });
  });

  describe('getOffset', () => {
    it('should return the offset when provided', () => {
      // Arrange
      const userFilter = new UserFilter({ offset: 20 });

      // Act & Assert
      expect(userFilter.getOffset()).toBe(20);
    });

    it('should return default offset of 0 when not provided', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.getOffset()).toBe(0);
    });

    it('should return default offset of 0 when offset is undefined', () => {
      // Arrange
      const userFilter = new UserFilter({ offset: undefined });

      // Act & Assert
      expect(userFilter.getOffset()).toBe(0);
    });
  });

  describe('getName', () => {
    it('should return the name when provided', () => {
      // Arrange
      const userFilter = new UserFilter({ name: 'John' });

      // Act & Assert
      expect(userFilter.getName()).toBe('John');
    });

    it('should return undefined when name is not provided', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.getName()).toBeUndefined();
    });
  });

  describe('getEmail', () => {
    it('should return the email when provided', () => {
      // Arrange
      const userFilter = new UserFilter({ email: 'john@example.com' });

      // Act & Assert
      expect(userFilter.getEmail()).toBe('john@example.com');
    });

    it('should return undefined when email is not provided', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.getEmail()).toBeUndefined();
    });
  });

  describe('getRoleName', () => {
    it('should return the roleName when provided', () => {
      // Arrange
      const userFilter = new UserFilter({ roleName: 'administrator' });

      // Act & Assert
      expect(userFilter.getRoleName()).toBe('administrator');
    });

    it('should return undefined when roleName is not provided', () => {
      // Arrange
      const userFilter = new UserFilter({});

      // Act & Assert
      expect(userFilter.getRoleName()).toBeUndefined();
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const filter1 = new UserFilter({ name: 'John', limit: 10 });
      const filter2 = new UserFilter({ name: 'John', limit: 10 });

      // Act & Assert
      expect(filter1.equals(filter2)).toBe(false);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const filter1 = new UserFilter({ name: 'John' });
      const filter2 = new UserFilter({ name: 'Jane' });

      // Act & Assert
      expect(filter1.equals(filter2)).toBe(false);
    });

    it('should not be equal when one has additional properties', () => {
      // Arrange
      const filter1 = new UserFilter({ name: 'John' });
      const filter2 = new UserFilter({
        name: 'John',
        email: 'john@example.com',
      });

      // Act & Assert
      expect(filter1.equals(filter2)).toBe(false);
    });
  });
});
