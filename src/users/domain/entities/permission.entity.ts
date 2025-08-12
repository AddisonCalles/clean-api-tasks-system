import {
  PermissionId,
  PermissionName,
  PermissionDescription,
} from '@users/domain/value-objects';

export class Permission {
  constructor(
    private readonly _id: PermissionId,
    private _name: PermissionName,
    private _description: PermissionDescription,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  // Getters
  get id(): PermissionId {
    return this._id;
  }

  get name(): PermissionName {
    return this._name;
  }

  get description(): PermissionDescription {
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
  public updateName(name: PermissionName): void {
    this._name = name;
    this.updateTimestamp();
  }

  public updateDescription(description: PermissionDescription): void {
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

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Factory method
  public static create(
    name: PermissionName,
    description: PermissionDescription,
  ): Permission {
    const permission = new Permission(
      PermissionId.generate(),
      name,
      description,
      new Date(),
      new Date(),
    );

    return permission;
  }

  // Reconstitution method
  public static reconstitute(
    id: PermissionId,
    name: PermissionName,
    description: PermissionDescription,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Permission {
    return new Permission(
      id,
      name,
      description,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}
