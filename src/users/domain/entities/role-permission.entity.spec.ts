import { RolePermission } from './role-permission.entity';
import { RoleId, PermissionId } from '@users/domain/value-objects';

describe('RolePermission Entity', () => {
  let roleId: RoleId;
  let permissionId: PermissionId;
  let createdAt: Date;

  beforeEach(() => {
    roleId = RoleId.generate();
    permissionId = PermissionId.generate();
    createdAt = new Date('2023-01-01T00:00:00Z');
  });

  describe('Constructor', () => {
    it('should create a role permission with all required properties', () => {
      const rolePermission = new RolePermission(
        roleId,
        permissionId,
        createdAt,
      );

      expect(rolePermission.roleId).toBe(roleId);
      expect(rolePermission.permissionId).toBe(permissionId);
      expect(rolePermission.createdAt).toBe(createdAt);
    });
  });

  describe('Getters', () => {
    let rolePermission: RolePermission;

    beforeEach(() => {
      rolePermission = new RolePermission(
        roleId,
        permissionId,
        createdAt,
      );
    });

    it('should return the correct role id', () => {
      expect(rolePermission.roleId).toBe(roleId);
    });

    it('should return the correct permission id', () => {
      expect(rolePermission.permissionId).toBe(permissionId);
    });

    it('should return the correct created at date', () => {
      expect(rolePermission.createdAt).toBe(createdAt);
    });
  });

  describe('Factory Method', () => {
    describe('create', () => {
      it('should create a new role permission with current timestamp', () => {
        const beforeCreation = new Date();
        const rolePermission = RolePermission.create(roleId, permissionId);
        const afterCreation = new Date();

        expect(rolePermission.roleId).toBe(roleId);
        expect(rolePermission.permissionId).toBe(permissionId);
        expect(rolePermission.createdAt).toBeInstanceOf(Date);
        expect(rolePermission.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
        expect(rolePermission.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      });

      it('should create different role permissions with different timestamps', () => {
        const rolePermission1 = RolePermission.create(roleId, permissionId);
        
        // Small delay to ensure different timestamps
        setTimeout(() => {
          const rolePermission2 = RolePermission.create(roleId, permissionId);
          expect(rolePermission1.createdAt.getTime()).toBeLessThan(rolePermission2.createdAt.getTime());
        }, 1);
      });
    });
  });

  describe('Reconstitution Method', () => {
    describe('reconstitute', () => {
      it('should reconstitute a role permission with all provided properties', () => {
        const rolePermission = RolePermission.reconstitute(
          roleId,
          permissionId,
          createdAt,
        );

        expect(rolePermission.roleId).toBe(roleId);
        expect(rolePermission.permissionId).toBe(permissionId);
        expect(rolePermission.createdAt).toBe(createdAt);
      });

      it('should reconstitute with different timestamps', () => {
        const differentCreatedAt = new Date('2023-01-02T00:00:00Z');
        const rolePermission = RolePermission.reconstitute(
          roleId,
          permissionId,
          differentCreatedAt,
        );

        expect(rolePermission.createdAt).toBe(differentCreatedAt);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle role permission creation and reconstitution', () => {
      // Create role permission
      const rolePermission = RolePermission.create(roleId, permissionId);

      expect(rolePermission.roleId).toBe(roleId);
      expect(rolePermission.permissionId).toBe(permissionId);
      expect(rolePermission.createdAt).toBeInstanceOf(Date);

      // Reconstitute with the same data
      const reconstitutedRolePermission = RolePermission.reconstitute(
        rolePermission.roleId,
        rolePermission.permissionId,
        rolePermission.createdAt,
      );

      expect(reconstitutedRolePermission.roleId).toBe(rolePermission.roleId);
      expect(reconstitutedRolePermission.permissionId).toBe(rolePermission.permissionId);
      expect(reconstitutedRolePermission.createdAt).toBe(rolePermission.createdAt);
    });

    it('should handle multiple role permissions', () => {
      const roleId1 = RoleId.generate();
      const roleId2 = RoleId.generate();
      const permissionId1 = PermissionId.generate();
      const permissionId2 = PermissionId.generate();

      const rolePermission1 = RolePermission.create(roleId1, permissionId1);
      const rolePermission2 = RolePermission.create(roleId2, permissionId2);

      expect(rolePermission1.roleId).toBe(roleId1);
      expect(rolePermission1.permissionId).toBe(permissionId1);
      expect(rolePermission2.roleId).toBe(roleId2);
      expect(rolePermission2.permissionId).toBe(permissionId2);

      expect(rolePermission1.roleId.toString()).not.toBe(rolePermission2.roleId.toString());
      expect(rolePermission1.permissionId.toString()).not.toBe(rolePermission2.permissionId.toString());
    });

    it('should handle role permission with same role but different permissions', () => {
      const permissionId1 = PermissionId.generate();
      const permissionId2 = PermissionId.generate();

      const rolePermission1 = RolePermission.create(roleId, permissionId1);
      const rolePermission2 = RolePermission.create(roleId, permissionId2);

      expect(rolePermission1.roleId).toBe(rolePermission2.roleId);
      expect(rolePermission1.permissionId).not.toBe(rolePermission2.permissionId);
    });

    it('should handle role permission with same permission but different roles', () => {
      const roleId1 = RoleId.generate();
      const roleId2 = RoleId.generate();

      const rolePermission1 = RolePermission.create(roleId1, permissionId);
      const rolePermission2 = RolePermission.create(roleId2, permissionId);

      expect(rolePermission1.roleId).not.toBe(rolePermission2.roleId);
      expect(rolePermission1.permissionId).toBe(rolePermission2.permissionId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle role permission with same role and permission ids', () => {
      const rolePermission1 = RolePermission.create(roleId, permissionId);
      const rolePermission2 = RolePermission.create(roleId, permissionId);

      expect(rolePermission1.roleId).toBe(rolePermission2.roleId);
      expect(rolePermission1.permissionId).toBe(rolePermission2.permissionId);
      expect(rolePermission1.createdAt.getTime()).toBeLessThanOrEqual(rolePermission2.createdAt.getTime());
    });

    it('should handle role permission with very old creation date', () => {
      const oldCreatedAt = new Date('2000-01-01T00:00:00Z');
      const rolePermission = RolePermission.reconstitute(
        roleId,
        permissionId,
        oldCreatedAt,
      );

      expect(rolePermission.createdAt).toBe(oldCreatedAt);
      expect(rolePermission.createdAt.getTime()).toBeLessThan(new Date().getTime());
    });

    it('should handle role permission with future creation date', () => {
      const futureCreatedAt = new Date('2030-01-01T00:00:00Z');
      const rolePermission = RolePermission.reconstitute(
        roleId,
        permissionId,
        futureCreatedAt,
      );

      expect(rolePermission.createdAt).toBe(futureCreatedAt);
      expect(rolePermission.createdAt.getTime()).toBeGreaterThan(new Date().getTime());
    });
  });
});
