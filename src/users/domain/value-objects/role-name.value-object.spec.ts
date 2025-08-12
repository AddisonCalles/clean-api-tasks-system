import { RoleName, RoleNameEnum } from './role-name.value-object';
import { RoleNameInvalidException } from '../exceptions/role-name-invalid.exception';

describe('RoleName', () => {
  describe('constructor', () => {
    it('should create RoleName with valid administrator value', () => {
      // Arrange
      const validRole = 'administrator';

      // Act
      const roleName = new RoleName(validRole);

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(validRole);
    });

    it('should create RoleName with valid member value', () => {
      // Arrange
      const validRole = 'member';

      // Act
      const roleName = new RoleName(validRole);

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(validRole);
    });

    it('should create RoleName with uppercase value and convert to lowercase', () => {
      // Arrange
      const uppercaseRole = 'ADMINISTRATOR';
      const expectedRole = 'administrator';

      // Act
      const roleName = new RoleName(uppercaseRole);

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(expectedRole);
    });

    it('should create RoleName with mixed case value and convert to lowercase', () => {
      // Arrange
      const mixedRole = 'AdMiNiStRaToR';
      const expectedRole = 'administrator';

      // Act
      const roleName = new RoleName(mixedRole);

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(expectedRole);
    });

    it('should trim whitespace from valid role', () => {
      // Arrange
      const roleWithSpaces = '  administrator  ';
      const expectedRole = 'administrator';

      // Act
      const roleName = new RoleName(roleWithSpaces);

      // Assert
      expect(roleName.value).toBe(expectedRole);
    });

    it('should throw RoleNameInvalidException when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName('')).toThrow(RoleNameInvalidException);
      expect(() => new RoleName('')).toThrow('Role name cannot be empty');
    });

    it('should throw RoleNameInvalidException when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName('   ')).toThrow(RoleNameInvalidException);
      expect(() => new RoleName('   ')).toThrow('Role name cannot be empty');
    });

    it('should throw RoleNameInvalidException when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName(null as any)).toThrow(RoleNameInvalidException);
      expect(() => new RoleName(null as any)).toThrow(
        'Role name cannot be empty',
      );
    });

    it('should throw RoleNameInvalidException when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName(undefined as any)).toThrow(
        RoleNameInvalidException,
      );
      expect(() => new RoleName(undefined as any)).toThrow(
        'Role name cannot be empty',
      );
    });

    it('should throw RoleNameInvalidException when value is invalid role', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName('invalid_role')).toThrow(
        RoleNameInvalidException,
      );
      expect(() => new RoleName('invalid_role')).toThrow(
        'Role name invalid: invalid_role. Role name must be one of: administrator, member',
      );
    });

    it('should throw RoleNameInvalidException when value is similar but invalid', () => {
      // Arrange & Act & Assert
      expect(() => new RoleName('admin')).toThrow(RoleNameInvalidException);
      expect(() => new RoleName('Admin')).toThrow(RoleNameInvalidException);
      expect(() => new RoleName('members')).toThrow(RoleNameInvalidException);
    });
  });

  describe('static factory methods', () => {
    it('should create admin role using admin() method', () => {
      // Act
      const roleName = RoleName.admin();

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(RoleNameEnum.ADMINISTRATOR);
      expect(roleName.isAdmin()).toBe(true);
    });

    it('should create member role using member() method', () => {
      // Act
      const roleName = RoleName.member();

      // Assert
      expect(roleName).toBeInstanceOf(RoleName);
      expect(roleName.value).toBe(RoleNameEnum.MEMBER);
      expect(roleName.isMember()).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('should return true for administrator role', () => {
      // Arrange
      const roleName = new RoleName('administrator');

      // Act & Assert
      expect(roleName.isAdmin()).toBe(true);
    });

    it('should return false for member role', () => {
      // Arrange
      const roleName = new RoleName('member');

      // Act & Assert
      expect(roleName.isAdmin()).toBe(false);
    });

    it('should return true for administrator role with different case', () => {
      // Arrange
      const roleName = new RoleName('ADMINISTRATOR');

      // Act & Assert
      expect(roleName.isAdmin()).toBe(true);
    });
  });

  describe('isMember', () => {
    it('should return true for member role', () => {
      // Arrange
      const roleName = new RoleName('member');

      // Act & Assert
      expect(roleName.isMember()).toBe(true);
    });

    it('should return false for administrator role', () => {
      // Arrange
      const roleName = new RoleName('administrator');

      // Act & Assert
      expect(roleName.isMember()).toBe(false);
    });

    it('should return true for member role with different case', () => {
      // Arrange
      const roleName = new RoleName('MEMBER');

      // Act & Assert
      expect(roleName.isMember()).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validRole = 'administrator';
      const roleName = new RoleName(validRole);

      // Act
      const result = roleName.toString();

      // Assert
      expect(result).toBe(validRole);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const role1 = new RoleName('administrator');
      const role2 = new RoleName('administrator');

      // Act & Assert
      expect(role1.equals(role2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const role1 = new RoleName('administrator');
      const role2 = new RoleName('member');

      // Act & Assert
      expect(role1.equals(role2)).toBe(false);
    });

    it('should be equal when values are the same but with different case', () => {
      // Arrange
      const role1 = new RoleName('administrator');
      const role2 = new RoleName('ADMINISTRATOR');

      // Act & Assert
      expect(role1.equals(role2)).toBe(true);
    });

    it('should be equal when values are the same but with different whitespace', () => {
      // Arrange
      const role1 = new RoleName('administrator');
      const role2 = new RoleName('  administrator  ');

      // Act & Assert
      expect(role1.equals(role2)).toBe(true);
    });
  });
});
