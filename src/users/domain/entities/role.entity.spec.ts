import { RoleNameEnum } from '../value-objects/role-name.value-object';
import { Role } from './role.entity';
import { RoleId, RoleName, RoleDescription } from '@users/domain/value-objects';

describe('Role Entity', () => {
  let roleId: RoleId;
  let roleName: RoleName;
  let roleDescription: RoleDescription;
  let createdAt: Date;
  let updatedAt: Date;

  beforeEach(() => {
    roleId = RoleId.generate();
    roleName = new RoleName(RoleNameEnum.ADMINISTRATOR);
    roleDescription = new RoleDescription(
      'Administrator role with full access',
    );
    createdAt = new Date('2023-01-01T00:00:00Z');
    updatedAt = new Date('2023-01-01T00:00:00Z');
  });

  describe('Constructor', () => {
    it('should create a role with all required properties', () => {
      const role = new Role(
        roleId,
        roleName,
        roleDescription,
        createdAt,
        updatedAt,
      );

      expect(role.id).toBe(roleId);
      expect(role.name).toBe(roleName);
      expect(role.description).toBe(roleDescription);
      expect(role.createdAt).toBe(createdAt);
      expect(role.updatedAt).toBe(updatedAt);
      expect(role.deletedAt).toBeNull();
    });

    it('should create a role with deletedAt when provided', () => {
      const deletedAt = new Date('2023-01-02T00:00:00Z');
      const role = new Role(
        roleId,
        roleName,
        roleDescription,
        createdAt,
        updatedAt,
        deletedAt,
      );

      expect(role.deletedAt).toBe(deletedAt);
    });
  });

  describe('Getters', () => {
    let role: Role;

    beforeEach(() => {
      role = new Role(roleId, roleName, roleDescription, createdAt, updatedAt);
    });

    it('should return the correct id', () => {
      expect(role.id).toBe(roleId);
    });

    it('should return the correct name', () => {
      expect(role.name).toBe(roleName);
    });

    it('should return the correct description', () => {
      expect(role.description).toBe(roleDescription);
    });

    it('should return the correct created at date', () => {
      expect(role.createdAt).toBe(createdAt);
    });

    it('should return the correct updated at date', () => {
      expect(role.updatedAt).toBe(updatedAt);
    });

    it('should return null for deleted at when not deleted', () => {
      expect(role.deletedAt).toBeNull();
    });
  });

  describe('Business Methods', () => {
    let role: Role;
    let originalUpdatedAt: Date;

    beforeEach(() => {
      role = new Role(roleId, roleName, roleDescription, createdAt, updatedAt);
      originalUpdatedAt = role.updatedAt;
    });

    describe('updateName', () => {
      it('should update the name and update timestamp', () => {
        const newName = new RoleName('member');

        role.updateName(newName);

        expect(role.name).toBe(newName);
        expect(role.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('updateDescription', () => {
      it('should update the description and update timestamp', () => {
        const newDescription = new RoleDescription('Updated role description');

        role.updateDescription(newDescription);

        expect(role.description).toBe(newDescription);
        expect(role.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('markAsDeleted', () => {
      it('should mark the role as deleted and update timestamp', () => {
        role.markAsDeleted();

        expect(role.deletedAt).not.toBeNull();
        expect(role.deletedAt).toBeInstanceOf(Date);
        expect(role.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('restore', () => {
      it('should restore a deleted role and update timestamp', () => {
        role.markAsDeleted();
        expect(role.isDeleted()).toBe(true);

        role.restore();

        expect(role.deletedAt).toBeNull();
        expect(role.isDeleted()).toBe(false);
        expect(role.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime(),
        );
      });
    });

    describe('isDeleted', () => {
      it('should return false when role is not deleted', () => {
        expect(role.isDeleted()).toBe(false);
      });

      it('should return true when role is deleted', () => {
        role.markAsDeleted();
        expect(role.isDeleted()).toBe(true);
      });
    });

    describe('isAdmin', () => {
      it('should return true when role name is admin', () => {
        const adminRole = new Role(
          roleId,
          new RoleName(RoleNameEnum.ADMINISTRATOR),
          roleDescription,
          createdAt,
          updatedAt,
        );

        expect(adminRole.isAdmin()).toBe(true);
      });

      it('should return false when role name is not admin', () => {
        const memberRole = new Role(
          roleId,
          new RoleName('member'),
          roleDescription,
          createdAt,
          updatedAt,
        );

        expect(memberRole.isAdmin()).toBe(false);
      });
    });

    describe('isMember', () => {
      it('should return true when role name is member', () => {
        const memberRole = new Role(
          roleId,
          new RoleName('member'),
          roleDescription,
          createdAt,
          updatedAt,
        );

        expect(memberRole.isMember()).toBe(true);
      });

      it('should return false when role name is not member', () => {
        const adminRole = new Role(
          roleId,
          new RoleName(RoleNameEnum.ADMINISTRATOR),
          roleDescription,
          createdAt,
          updatedAt,
        );

        expect(adminRole.isMember()).toBe(false);
      });
    });
  });

  describe('Factory Method', () => {
    describe('create', () => {
      it('should create a new role with generated id and timestamps', () => {
        const role = Role.create(roleName, roleDescription);

        expect(role.id).toBeInstanceOf(RoleId);
        expect(role.name).toBe(roleName);
        expect(role.description).toBe(roleDescription);
        expect(role.createdAt).toBeInstanceOf(Date);
        expect(role.updatedAt).toBeInstanceOf(Date);
        expect(role.deletedAt).toBeNull();
        expect(role.isDeleted()).toBe(false);
      });

      it('should generate different ids for different roles', () => {
        const role1 = Role.create(roleName, roleDescription);
        const role2 = Role.create(roleName, roleDescription);

        expect(role1.id.toString()).not.toBe(role2.id.toString());
      });
    });
  });

  describe('Reconstitution Method', () => {
    describe('reconstitute', () => {
      it('should reconstitute a role with all provided properties', () => {
        const deletedAt = new Date('2023-01-02T00:00:00Z');

        const role = Role.reconstitute(
          roleId,
          roleName,
          roleDescription,
          createdAt,
          updatedAt,
          deletedAt,
        );

        expect(role.id).toBe(roleId);
        expect(role.name).toBe(roleName);
        expect(role.description).toBe(roleDescription);
        expect(role.createdAt).toBe(createdAt);
        expect(role.updatedAt).toBe(updatedAt);
        expect(role.deletedAt).toBe(deletedAt);
        expect(role.isDeleted()).toBe(true);
      });

      it('should reconstitute a role without deletedAt', () => {
        const role = Role.reconstitute(
          roleId,
          roleName,
          roleDescription,
          createdAt,
          updatedAt,
          null,
        );

        expect(role.deletedAt).toBeNull();
        expect(role.isDeleted()).toBe(false);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete role lifecycle', () => {
      // Create role
      const role = Role.create(roleName, roleDescription);
      expect(role.isDeleted()).toBe(false);

      // Update role properties
      const newName = new RoleName('member');
      const newDescription = new RoleDescription('Updated role description');

      role.updateName(newName);
      role.updateDescription(newDescription);

      expect(role.name).toBe(newName);
      expect(role.description).toBe(newDescription);

      // Mark as deleted
      role.markAsDeleted();
      expect(role.isDeleted()).toBe(true);

      // Restore role
      role.restore();
      expect(role.isDeleted()).toBe(false);
    });

    it('should correctly identify role types', () => {
      const adminRole = Role.create(
        new RoleName(RoleNameEnum.ADMINISTRATOR),
        new RoleDescription('Administrator role'),
      );
      const memberRole = Role.create(
        new RoleName('member'),
        new RoleDescription('Member role'),
      );

      expect(adminRole.isAdmin()).toBe(true);
      expect(adminRole.isMember()).toBe(false);
      expect(memberRole.isAdmin()).toBe(false);
      expect(memberRole.isMember()).toBe(true);
    });
  });
});
