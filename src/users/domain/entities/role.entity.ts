import { RoleId, RoleName, RoleDescription } from '@users/domain/value-objects';

export class Role {
  constructor(
    private readonly _id: RoleId,
    private _name: RoleName,
    private _description: RoleDescription,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  // Getters
  get id(): RoleId {
    return this._id;
  }

  get name(): RoleName {
    return this._name;
  }

  get description(): RoleDescription {
    return this._description;
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
  public updateName(name: RoleName): void {
    this._name = name;
    this.updateTimestamp();
  }

  public updateDescription(description: RoleDescription): void {
    this._description = description;
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

  public isAdmin(): boolean {
    return this._name.isAdmin();
  }

  public isMember(): boolean {
    return this._name.isMember();
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Factory method
  public static create(name: RoleName, description: RoleDescription): Role {
    const role = new Role(
      RoleId.generate(),
      name,
      description,
      new Date(),
      new Date(),
    );

    return role;
  }

  // Reconstitution method
  public static reconstitute(
    id: RoleId,
    name: RoleName,
    description: RoleDescription,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Role {
    return new Role(id, name, description, createdAt, updatedAt, deletedAt);
  }
}
