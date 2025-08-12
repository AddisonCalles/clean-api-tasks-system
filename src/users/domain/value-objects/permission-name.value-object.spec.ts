import {
  PermissionName,
  PermissionNameEnum,
} from './permission-name.value-object';
import { PermissionNameInvalidException } from '../exceptions/permission-name-invalid.exception';

describe('PermissionName', () => {
  describe('constructor', () => {
    it('should create PermissionName with valid create_task value', () => {
      // Arrange
      const validPermission = 'create_task';

      // Act
      const permissionName = new PermissionName(validPermission);

      // Assert
      expect(permissionName).toBeInstanceOf(PermissionName);
      expect(permissionName.value).toBe(validPermission);
    });

    it('should create PermissionName with valid manage_users value', () => {
      // Arrange
      const validPermission = 'manage_users';

      // Act
      const permissionName = new PermissionName(validPermission);

      // Assert
      expect(permissionName).toBeInstanceOf(PermissionName);
      expect(permissionName.value).toBe(validPermission);
    });

    it('should create PermissionName with uppercase value and convert to lowercase', () => {
      // Arrange
      const uppercasePermission = 'CREATE_TASK';
      const expectedPermission = 'create_task';

      // Act
      const permissionName = new PermissionName(uppercasePermission);

      // Assert
      expect(permissionName).toBeInstanceOf(PermissionName);
      expect(permissionName.value).toBe(expectedPermission);
    });

    it('should create PermissionName with mixed case value and convert to lowercase', () => {
      // Arrange
      const mixedPermission = 'CrEaTe_TaSk';
      const expectedPermission = 'create_task';

      // Act
      const permissionName = new PermissionName(mixedPermission);

      // Assert
      expect(permissionName).toBeInstanceOf(PermissionName);
      expect(permissionName.value).toBe(expectedPermission);
    });

    it('should trim whitespace from valid permission', () => {
      // Arrange
      const permissionWithSpaces = '  create_task  ';
      const expectedPermission = 'create_task';

      // Act
      const permissionName = new PermissionName(permissionWithSpaces);

      // Assert
      expect(permissionName.value).toBe(expectedPermission);
    });

    it('should accept all valid permission names', () => {
      // Arrange
      const validPermissions = Object.values(PermissionNameEnum);

      // Act & Assert
      validPermissions.forEach((permission) => {
        expect(() => new PermissionName(permission)).not.toThrow();
      });
    });

    it('should throw PermissionNameInvalidException when value is empty', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName('')).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName('')).toThrow(
        'Permission name cannot be empty',
      );
    });

    it('should throw PermissionNameInvalidException when value is only whitespace', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName('   ')).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName('   ')).toThrow(
        'Permission name cannot be empty',
      );
    });

    it('should throw PermissionNameInvalidException when value is null', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName(null as any)).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName(null as any)).toThrow(
        'Permission name cannot be empty',
      );
    });

    it('should throw PermissionNameInvalidException when value is undefined', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName(undefined as any)).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName(undefined as any)).toThrow(
        'Permission name cannot be empty',
      );
    });

    it('should throw PermissionNameInvalidException when value is invalid permission', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName('invalid_permission')).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName('invalid_permission')).toThrow(
        'Permission name must be one of: create_task, edit_task, delete_task, assign_users_task, view_all_tasks, manage_users, access_analytics, create_user, edit_user, delete_user, view_user, view_all_users, manage_roles, manage_permissions, manage_role_permissions',
      );
    });

    it('should throw PermissionNameInvalidException when value is similar but invalid', () => {
      // Arrange & Act & Assert
      expect(() => new PermissionName('create_tasks')).toThrow(
        PermissionNameInvalidException,
      );
      expect(() => new PermissionName('manage_user')).toThrow(
        PermissionNameInvalidException,
      );
    });
  });

  describe('allow', () => {
    it('should return true when permission matches', () => {
      // Arrange
      const permissionName = new PermissionName('create_task');

      // Act & Assert
      expect(permissionName.allow(PermissionNameEnum.CREATE_TASK)).toBe(true);
    });

    it('should return false when permission does not match', () => {
      // Arrange
      const permissionName = new PermissionName('create_task');

      // Act & Assert
      expect(permissionName.allow(PermissionNameEnum.EDIT_TASK)).toBe(false);
    });

    it('should return true when permission matches with different case', () => {
      // Arrange
      const permissionName = new PermissionName('CREATE_TASK');

      // Act & Assert
      expect(permissionName.allow(PermissionNameEnum.CREATE_TASK)).toBe(true);
    });

    it('should return true for manage_users permission', () => {
      // Arrange
      const permissionName = new PermissionName('manage_users');

      // Act & Assert
      expect(permissionName.allow(PermissionNameEnum.MANAGE_USERS)).toBe(true);
    });

    it('should return true for access_analytics permission', () => {
      // Arrange
      const permissionName = new PermissionName('access_analytics');

      // Act & Assert
      expect(permissionName.allow(PermissionNameEnum.ACCESS_ANALYTICS)).toBe(
        true,
      );
    });
  });

  describe('toString', () => {
    it('should return the value as string', () => {
      // Arrange
      const validPermission = 'create_task';
      const permissionName = new PermissionName(validPermission);

      // Act
      const result = permissionName.toString();

      // Assert
      expect(result).toBe(validPermission);
    });
  });

  describe('equality', () => {
    it('should be equal when values are the same', () => {
      // Arrange
      const perm1 = new PermissionName('create_task');
      const perm2 = new PermissionName('create_task');

      // Act & Assert
      expect(perm1.equals(perm2)).toBe(true);
    });

    it('should not be equal when values are different', () => {
      // Arrange
      const perm1 = new PermissionName('create_task');
      const perm2 = new PermissionName('edit_task');

      // Act & Assert
      expect(perm1.equals(perm2)).toBe(false);
    });

    it('should be equal when values are the same but with different case', () => {
      // Arrange
      const perm1 = new PermissionName('create_task');
      const perm2 = new PermissionName('CREATE_TASK');

      // Act & Assert
      expect(perm1.equals(perm2)).toBe(true);
    });

    it('should be equal when values are the same but with different whitespace', () => {
      // Arrange
      const perm1 = new PermissionName('create_task');
      const perm2 = new PermissionName('  create_task  ');

      // Act & Assert
      expect(perm1.equals(perm2)).toBe(true);
    });
  });
});
