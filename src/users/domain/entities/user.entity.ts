import {
  UserId,
  UserName,
  UserEmail,
  UserPassword,
  RoleId,
} from '@users/domain/value-objects';
import { PasswordHash } from '../value-objects/password-hash.value-object';

export class User {
  constructor(
    private readonly _id: UserId,
    private _name: UserName,
    private _email: UserEmail,
    private _passwordHash: PasswordHash,
    private _roleId: RoleId,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  // Getters
  get id(): UserId {
    return this._id;
  }

  get name(): UserName {
    return this._name;
  }

  get email(): UserEmail {
    return this._email;
  }

  get passwordHash(): PasswordHash {
    return this._passwordHash;
  }

  get roleId(): RoleId {
    return this._roleId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Business methods
  public updateName(name: UserName): void {
    this._name = name;
    this.updateTimestamp();
  }

  public updateEmail(email: UserEmail): void {
    this._email = email;
    this.updateTimestamp();
  }

  public updatePassword(passwordHash: PasswordHash): void {
    this._passwordHash = passwordHash;
    this.updateTimestamp();
  }

  public updateRole(roleId: RoleId): void {
    this._roleId = roleId;
    this.updateTimestamp();
  }

  public markAsDeleted(): void {
    this._deletedAt = new Date();
    this.updateTimestamp();
  }

  public restore(): void {
    this._deletedAt = null;
    this.updateTimestamp();
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Factory method
  public static create(
    name: UserName,
    email: UserEmail,
    passwordHash: PasswordHash,
    roleId: RoleId,
  ): User {
    const user = new User(
      UserId.generate(),
      name,
      email,
      passwordHash,
      roleId,
      new Date(),
      new Date(),
    );

    return user;
  }

  // Reconstitution method
  public static reconstitute(
    id: UserId,
    name: UserName,
    email: UserEmail,
    passwordHash: PasswordHash,
    roleId: RoleId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): User {
    return new User(
      id,
      name,
      email,
      passwordHash,
      roleId,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
