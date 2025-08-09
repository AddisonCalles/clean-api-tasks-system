import { ValueObject } from '@shared/domain/value-objects/value-object';

export enum TaskStatusEnum {
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold',
}

export class TaskStatus extends ValueObject<TaskStatusEnum> {
  constructor(value: TaskStatusEnum) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: TaskStatusEnum): void {
    if (!Object.values(TaskStatusEnum).includes(value)) {
      throw new Error('Invalid task status');
    }
  }

  public isActive(): boolean {
    return this.value === TaskStatusEnum.ACTIVE;
  }

  public isInProgress(): boolean {
    return this.value === TaskStatusEnum.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.value === TaskStatusEnum.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.value === TaskStatusEnum.CANCELLED;
  }

  public isOnHold(): boolean {
    return this.value === TaskStatusEnum.ON_HOLD;
  }

  public canBeCompleted(): boolean {
    return (
      this.value === TaskStatusEnum.ACTIVE ||
      this.value === TaskStatusEnum.IN_PROGRESS
    );
  }

  public canBeCancelled(): boolean {
    return (
      this.value === TaskStatusEnum.ACTIVE ||
      this.value === TaskStatusEnum.IN_PROGRESS ||
      this.value === TaskStatusEnum.ON_HOLD
    );
  }

  public toString(): string {
    return this.value;
  }

  public static fromString(status: string): TaskStatus {
    switch (status.toLowerCase()) {
      case 'active':
        return TaskStatus.active();
      case 'in_progress':
        return TaskStatus.inProgress();
      case 'completed':
        return TaskStatus.completed();
      case 'cancelled':
        return TaskStatus.cancelled();
      case 'on_hold':
        return TaskStatus.onHold();
      default:
        throw new Error(`Invalid status: ${status}`);
    }
  }

  // Factory methods
  public static active(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.ACTIVE);
  }

  public static inProgress(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.IN_PROGRESS);
  }

  public static completed(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.COMPLETED);
  }

  public static cancelled(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.CANCELLED);
  }

  public static onHold(): TaskStatus {
    return new TaskStatus(TaskStatusEnum.ON_HOLD);
  }
}
