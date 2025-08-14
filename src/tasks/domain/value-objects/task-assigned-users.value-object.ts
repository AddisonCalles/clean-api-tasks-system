import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskAssignedUsersInvalidException } from '@tasks/domain/exceptions';

export interface ITaskAssignedUser {
  userId: string;
  email: string;
  assignedAt: Date;
}

export class TaskAssignedUsers extends ValueObject<ITaskAssignedUser[]> {
  constructor(value: ITaskAssignedUser[]) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: ITaskAssignedUser[]): void {
    if (!Array.isArray(value)) {
      throw new TaskAssignedUsersInvalidException(
        'Assigned users must be an array',
      );
    }

    // Check for duplicate user IDs
    const userIds = value.map((user) => user.userId);
    const uniqueUserIds = new Set(userIds);
    if (userIds.length !== uniqueUserIds.size) {
      throw new TaskAssignedUsersInvalidException(
        'Task cannot have duplicate assigned users',
      );
    }
  }

  public addUser(user: ITaskAssignedUser): void {
    if (!this.hasUser(user)) {
      this.value.push(user);
    }
  }

  public removeUser(user: ITaskAssignedUser): void {
    this.value = this.value.filter((u) => u.userId !== user.userId);
  }

  public hasUser(user: ITaskAssignedUser): boolean {
    return this.value.some((u) => u.userId === user.userId);
  }
}
