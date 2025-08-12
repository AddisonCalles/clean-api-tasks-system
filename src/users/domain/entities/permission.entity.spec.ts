import { PermissionNameEnum } from '../value-objects/permission-name.value-object';
import { Permission } from './permission.entity';
import {
  PermissionId,
  PermissionName,
  PermissionDescription,
} from '@users/domain/value-objects';

describe('Permission Entity', () => {
  let permissionId: PermissionId;
  let permissionName: PermissionName;
  let permissionDescription: PermissionDescription;
  let createdAt: Date;
  let updatedAt: Date;

  beforeEach(() => {
    permissionId = PermissionId.generate();
    permissionName = new PermissionName(PermissionNameEnum.CREATE_TASK);
    permissionDescription = new PermissionDescription(
      'Permission to create tasks',
    );
    createdAt = new Date('2023-01-01T00:00:00Z');
    updatedAt = new Date('2023-01-01T00:00:00Z');
  });

  describe('Constructor', () => {
    it('should create a permission with all required properties', () => {
      const permission = new Permission(
        permissionId,
        permissionName,
        permissionDescription,
        createdAt,
        updatedAt,
      );

      expect(permission.id).toBe(permissionId);
      expect(permission.name).toBe(permissionName);
      expect(permission.description).toBe(permissionDescription);
      expect(permission.createdAt).toBe(createdAt);
      expect(permission.updatedAt).toBe(updatedAt);
      expect(permission.deletedAt).toBeNull();
    });

    it('should create a permission with deletedAt when provided', () => {
      const deletedAt = new Date('2023-01-02T00:00:00Z');
      const permission = new Permission(
        permissionId,
        permissionName,
        permissionDescription,
        createdAt,
        updatedAt,
        deletedAt,
      );

      expect(permission.deletedAt).toBe(deletedAt);
    });
  });

  describe('Getters', () => {
    let permission: Permission;

    beforeEach(() => {
      permission = new Permission(
        permissionId,
        permissionName,
        permissionDescription,
        createdAt,
        updatedAt,
      );
    });

    it('should return the correct id', () => {
      expect(permission.id).toBe(permissionId);
    });

    it('should return the correct name', () => {
      expect(permission.name).toBe(permissionName);
    });

    it('should return the correct description', () => {
      expect(permission.description).toBe(permissionDescription);
    });

    it('should return the correct created at date', () => {
      expect(permission.createdAt).toBe(createdAt);
    });

    it('should return the correct updated at date', () => {
      expect(permission.updatedAt).toBe(updatedAt);
    });

    it('should return null for deleted at when not deleted', () => {
      expect(permission.deletedAt).toBeNull();
    });
  });

  describe('Business Methods', () => {
    let permission: Permission;
    let originalUpdatedAt: Date;

    beforeEach(() => {
      permission = new Permission(
        permissionId,
        permissionName,
        permissionDescription,
        createdAt,
        updatedAt,
      );
      originalUpdatedAt = permission.updatedAt;
    });

    describe('updateName', () => {
      it('should update the name and update timestamp', () => {
        const newName = new PermissionName(PermissionNameEnum.EDIT_USER);

        permission.updateName(newName);

        expect(permission.name).toBe(newName);
        expect(permission.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('updateDescription', () => {
      it('should update the description and update timestamp', () => {
        const newDescription = new PermissionDescription(
          'Updated permission description',
        );

        permission.updateDescription(newDescription);

        expect(permission.description).toBe(newDescription);
        expect(permission.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('markAsDeleted', () => {
      it('should mark the permission as deleted and update timestamp', () => {
        permission.markAsDeleted();

        expect(permission.deletedAt).not.toBeNull();
        expect(permission.deletedAt).toBeInstanceOf(Date);
        expect(permission.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('restore', () => {
      it('should restore a deleted permission and update timestamp', () => {
        permission.markAsDeleted();
        expect(permission.isDeleted()).toBe(true);

        permission.restore();

        expect(permission.deletedAt).toBeNull();
        expect(permission.isDeleted()).toBe(false);
        expect(permission.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('isDeleted', () => {
      it('should return false when permission is not deleted', () => {
        expect(permission.isDeleted()).toBe(false);
      });

      it('should return true when permission is deleted', () => {
        permission.markAsDeleted();
        expect(permission.isDeleted()).toBe(true);
      });
    });
  });

  describe('Factory Method', () => {
    describe('create', () => {
      it('should create a new permission with generated id and timestamps', () => {
        const permission = Permission.create(
          permissionName,
          permissionDescription,
        );

        expect(permission.id).toBeInstanceOf(PermissionId);
        expect(permission.name).toBe(permissionName);
        expect(permission.description).toBe(permissionDescription);
        expect(permission.createdAt).toBeInstanceOf(Date);
        expect(permission.updatedAt).toBeInstanceOf(Date);
        expect(permission.deletedAt).toBeNull();
        expect(permission.isDeleted()).toBe(false);
      });

      it('should generate different ids for different permissions', () => {
        const permission1 = Permission.create(
          permissionName,
          permissionDescription,
        );
        const permission2 = Permission.create(
          permissionName,
          permissionDescription,
        );

        expect(permission1.id.toString()).not.toBe(permission2.id.toString());
      });
    });
  });

  describe('Reconstitution Method', () => {
    describe('reconstitute', () => {
      it('should reconstitute a permission with all provided properties', () => {
        const deletedAt = new Date('2023-01-02T00:00:00Z');

        const permission = Permission.reconstitute(
          permissionId,
          permissionName,
          permissionDescription,
          createdAt,
          updatedAt,
          deletedAt,
        );

        expect(permission.id).toBe(permissionId);
        expect(permission.name).toBe(permissionName);
        expect(permission.description).toBe(permissionDescription);
        expect(permission.createdAt).toBe(createdAt);
        expect(permission.updatedAt).toBe(updatedAt);
        expect(permission.deletedAt).toBe(deletedAt);
        expect(permission.isDeleted()).toBe(true);
      });

      it('should reconstitute a permission without deletedAt', () => {
        const permission = Permission.reconstitute(
          permissionId,
          permissionName,
          permissionDescription,
          createdAt,
          updatedAt,
          null,
        );

        expect(permission.deletedAt).toBeNull();
        expect(permission.isDeleted()).toBe(false);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete permission lifecycle', () => {
      // Create permission
      const permission = Permission.create(
        permissionName,
        permissionDescription,
      );
      expect(permission.isDeleted()).toBe(false);

      // Update permission properties
      const newName = new PermissionName(PermissionNameEnum.DELETE_USER);
      const newDescription = new PermissionDescription(
        'Updated permission description',
      );

      permission.updateName(newName);
      permission.updateDescription(newDescription);

      expect(permission.name).toBe(newName);
      expect(permission.description).toBe(newDescription);

      // Mark as deleted
      permission.markAsDeleted();
      expect(permission.isDeleted()).toBe(true);

      // Restore permission
      permission.restore();
      expect(permission.isDeleted()).toBe(false);
    });

    it('should handle multiple permissions with different names', () => {
      const createPermission = Permission.create(
        new PermissionName(PermissionNameEnum.CREATE_USER),
        new PermissionDescription('Create users permission'),
      );
      const updatePermission = Permission.create(
        new PermissionName(PermissionNameEnum.EDIT_USER),
        new PermissionDescription('Update users permission'),
      );
      const deletePermission = Permission.create(
        new PermissionName(PermissionNameEnum.DELETE_USER),
        new PermissionDescription('Delete users permission'),
      );

      expect(createPermission.name.toString()).toBe(
        PermissionNameEnum.CREATE_USER,
      );
      expect(updatePermission.name.toString()).toBe(
        PermissionNameEnum.EDIT_USER,
      );
      expect(deletePermission.name.toString()).toBe(
        PermissionNameEnum.DELETE_USER,
      );

      expect(createPermission.isDeleted()).toBe(false);
      expect(updatePermission.isDeleted()).toBe(false);
      expect(deletePermission.isDeleted()).toBe(false);
    });
  });
});
