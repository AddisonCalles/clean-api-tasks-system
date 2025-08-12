import { User } from './user.entity';
import {
  UserId,
  UserName,
  UserEmail,
  UserPassword,
  RoleId,
} from '@users/domain/value-objects';
import { PasswordHash } from '../value-objects/password-hash.value-object';

describe('User Entity', () => {
  let userId: UserId;
  let userName: UserName;
  let userEmail: UserEmail;
  let passwordHash: PasswordHash;
  let roleId: RoleId;
  let createdAt: Date;
  let updatedAt: Date;

  beforeEach(() => {
    userId = UserId.generate();
    userName = new UserName('John Doe');
    userEmail = new UserEmail('john.doe@example.com');
    passwordHash = new PasswordHash('hashedPassword123');
    roleId = RoleId.generate();
    createdAt = new Date('2023-01-01T00:00:00Z');
    updatedAt = new Date('2023-01-01T00:00:00Z');
  });

  describe('Constructor', () => {
    it('should create a user with all required properties', () => {
      const user = new User(
        userId,
        userName,
        userEmail,
        passwordHash,
        roleId,
        createdAt,
        updatedAt,
      );

      expect(user.id).toBe(userId);
      expect(user.name).toBe(userName);
      expect(user.email).toBe(userEmail);
      expect(user.passwordHash).toBe(passwordHash);
      expect(user.roleId).toBe(roleId);
      expect(user.createdAt).toBe(createdAt);
      expect(user.updatedAt).toBe(updatedAt);
      expect(user.deletedAt).toBeNull();
    });

    it('should create a user with deletedAt when provided', () => {
      const deletedAt = new Date('2023-01-02T00:00:00Z');
      const user = new User(
        userId,
        userName,
        userEmail,
        passwordHash,
        roleId,
        createdAt,
        updatedAt,
        deletedAt,
      );

      expect(user.deletedAt).toBe(deletedAt);
    });
  });

  describe('Getters', () => {
    let user: User;

    beforeEach(() => {
      user = new User(
        userId,
        userName,
        userEmail,
        passwordHash,
        roleId,
        createdAt,
        updatedAt,
      );
    });

    it('should return the correct id', () => {
      expect(user.id).toBe(userId);
    });

    it('should return the correct name', () => {
      expect(user.name).toBe(userName);
    });

    it('should return the correct email', () => {
      expect(user.email).toBe(userEmail);
    });

    it('should return the correct password hash', () => {
      expect(user.passwordHash).toBe(passwordHash);
    });

    it('should return the correct role id', () => {
      expect(user.roleId).toBe(roleId);
    });

    it('should return the correct created at date', () => {
      expect(user.createdAt).toBe(createdAt);
    });

    it('should return the correct updated at date', () => {
      expect(user.updatedAt).toBe(updatedAt);
    });

    it('should return null for deleted at when not deleted', () => {
      expect(user.deletedAt).toBeNull();
    });
  });

  describe('Business Methods', () => {
    let user: User;
    let originalUpdatedAt: Date;

    beforeEach(() => {
      user = new User(
        userId,
        userName,
        userEmail,
        passwordHash,
        roleId,
        createdAt,
        updatedAt,
      );
      originalUpdatedAt = user.updatedAt;
    });

    describe('updateName', () => {
      it('should update the name and update timestamp', () => {
        const newName = new UserName('Jane Doe');
        
        user.updateName(newName);

        expect(user.name).toBe(newName);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('updateEmail', () => {
      it('should update the email and update timestamp', () => {
        const newEmail = new UserEmail('jane.doe@example.com');
        
        user.updateEmail(newEmail);

        expect(user.email).toBe(newEmail);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('updatePassword', () => {
      it('should update the password hash and update timestamp', () => {
        const newPasswordHash = new PasswordHash('newHashedPassword123');
        
        user.updatePassword(newPasswordHash);

        expect(user.passwordHash).toBe(newPasswordHash);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('updateRole', () => {
      it('should update the role id and update timestamp', () => {
        const newRoleId = RoleId.generate();
        
        user.updateRole(newRoleId);

        expect(user.roleId).toBe(newRoleId);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('markAsDeleted', () => {
      it('should mark the user as deleted and update timestamp', () => {
        user.markAsDeleted();

        expect(user.deletedAt).not.toBeNull();
        expect(user.deletedAt).toBeInstanceOf(Date);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('restore', () => {
      it('should restore a deleted user and update timestamp', () => {
        user.markAsDeleted();
        expect(user.isDeleted()).toBe(true);

        user.restore();

        expect(user.deletedAt).toBeNull();
        expect(user.isDeleted()).toBe(false);
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      });
    });

    describe('isDeleted', () => {
      it('should return false when user is not deleted', () => {
        expect(user.isDeleted()).toBe(false);
      });

      it('should return true when user is deleted', () => {
        user.markAsDeleted();
        expect(user.isDeleted()).toBe(true);
      });
    });
  });

  describe('Factory Method', () => {
    describe('create', () => {
      it('should create a new user with generated id and timestamps', () => {
        const user = User.create(userName, userEmail, passwordHash, roleId);

        expect(user.id).toBeInstanceOf(UserId);
        expect(user.name).toBe(userName);
        expect(user.email).toBe(userEmail);
        expect(user.passwordHash).toBe(passwordHash);
        expect(user.roleId).toBe(roleId);
        expect(user.createdAt).toBeInstanceOf(Date);
        expect(user.updatedAt).toBeInstanceOf(Date);
        expect(user.deletedAt).toBeNull();
        expect(user.isDeleted()).toBe(false);
      });

      it('should generate different ids for different users', () => {
        const user1 = User.create(userName, userEmail, passwordHash, roleId);
        const user2 = User.create(userName, userEmail, passwordHash, roleId);

        expect(user1.id.toString()).not.toBe(user2.id.toString());
      });
    });
  });

  describe('Reconstitution Method', () => {
    describe('reconstitute', () => {
      it('should reconstitute a user with all provided properties', () => {
        const deletedAt = new Date('2023-01-02T00:00:00Z');
        
        const user = User.reconstitute(
          userId,
          userName,
          userEmail,
          passwordHash,
          roleId,
          createdAt,
          updatedAt,
          deletedAt,
        );

        expect(user.id).toBe(userId);
        expect(user.name).toBe(userName);
        expect(user.email).toBe(userEmail);
        expect(user.passwordHash).toBe(passwordHash);
        expect(user.roleId).toBe(roleId);
        expect(user.createdAt).toBe(createdAt);
        expect(user.updatedAt).toBe(updatedAt);
        expect(user.deletedAt).toBe(deletedAt);
        expect(user.isDeleted()).toBe(true);
      });

      it('should reconstitute a user without deletedAt', () => {
        const user = User.reconstitute(
          userId,
          userName,
          userEmail,
          passwordHash,
          roleId,
          createdAt,
          updatedAt,
          null,
        );

        expect(user.deletedAt).toBeNull();
        expect(user.isDeleted()).toBe(false);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user lifecycle', () => {
      // Create user
      const user = User.create(userName, userEmail, passwordHash, roleId);
      expect(user.isDeleted()).toBe(false);

      // Update user properties
      const newName = new UserName('Jane Doe');
      const newEmail = new UserEmail('jane.doe@example.com');
      const newPasswordHash = new PasswordHash('newHashedPassword123');
      const newRoleId = RoleId.generate();

      user.updateName(newName);
      user.updateEmail(newEmail);
      user.updatePassword(newPasswordHash);
      user.updateRole(newRoleId);

      expect(user.name).toBe(newName);
      expect(user.email).toBe(newEmail);
      expect(user.passwordHash).toBe(newPasswordHash);
      expect(user.roleId).toBe(newRoleId);

      // Mark as deleted
      user.markAsDeleted();
      expect(user.isDeleted()).toBe(true);

      // Restore user
      user.restore();
      expect(user.isDeleted()).toBe(false);
    });
  });
});
