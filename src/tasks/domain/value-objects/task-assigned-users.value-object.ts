import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskAssignedUsersInvalidException } from '@tasks/domain/exceptions';
import { UserId } from './user-id.value-object';

export class TaskAssignedUsers extends ValueObject<UserId[]> {
  constructor(value: UserId[]) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: UserId[]): void {
    if (!Array.isArray(value)) {
      throw new TaskAssignedUsersInvalidException(
        'Assigned users must be an array',
      );
    }

    // Check for duplicate user IDs
    const userIds = value.map((user) => user.value);
    const uniqueUserIds = new Set(userIds);
    if (userIds.length !== uniqueUserIds.size) {
      throw new TaskAssignedUsersInvalidException(
        'Task cannot have duplicate assigned users',
      );
    }
  }

  public addUser(userId: UserId): void {
    if (!this.hasUser(userId)) {
      this.value.push(userId);
    }
  }

  public removeUser(userId: UserId): void {
    this.value = this.value.filter((user) => !user.equals(userId));
  }

  public hasUser(userId: UserId): boolean {
    return this.value.some((user) => user.equals(userId));
  }

  public getCount(): number {
    return this.value.length;
  }

  public isEmpty(): boolean {
    return this.value.length === 0;
  }

  public toArray(): UserId[] {
    return [...this.value];
  }

  public toString(): string {
    return this.value.map((user) => user.value).join(',');
  }

  public static create(users: UserId[]): TaskAssignedUsers {
    return new TaskAssignedUsers(users);
  }

  public static createFromStrings(userIds: string[]): TaskAssignedUsers {
    const users = userIds.map((id) => new UserId(id));
    return new TaskAssignedUsers(users);
  }
}
