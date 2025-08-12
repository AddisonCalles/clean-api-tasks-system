import {
  TaskId,
  TaskTitle,
  TaskDescription,
  TaskEstimatedHours,
  TaskTimeSpent,
  TaskDueDate,
  TaskCompletionDate,
  TaskCost,
  TaskStatus,
  TaskAssignedUsers,
} from '@tasks/domain/value-objects';
import { UserId } from '@users/domain/value-objects';

export class Task {
  constructor(
    private readonly _id: TaskId,
    private _title: TaskTitle,
    private _description: TaskDescription,
    private _estimatedHours: TaskEstimatedHours,
    private _timeSpent: TaskTimeSpent,
    private _dueDate: TaskDueDate,
    private _completionDate: TaskCompletionDate | null,
    private _status: TaskStatus,
    private _cost: TaskCost,
    private _assignedUsers: TaskAssignedUsers,
    private readonly _createdBy: UserId,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  // Getters
  get id(): TaskId {
    return this._id;
  }
  get title(): TaskTitle {
    return this._title;
  }
  get description(): TaskDescription {
    return this._description;
  }
  get estimatedHours(): TaskEstimatedHours {
    return this._estimatedHours;
  }
  get timeSpent(): TaskTimeSpent {
    return this._timeSpent;
  }
  get dueDate(): TaskDueDate {
    return this._dueDate;
  }
  get completionDate(): TaskCompletionDate | null {
    return this._completionDate;
  }
  get status(): TaskStatus {
    return this._status;
  }
  get cost(): TaskCost {
    return this._cost;
  }
  get assignedUsers(): TaskAssignedUsers {
    return this._assignedUsers;
  }
  get createdBy(): UserId {
    return this._createdBy;
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

  // Business Logic Methods
  public updateTitle(newTitle: TaskTitle): void {
    this._title = newTitle;
    this._updatedAt = new Date();
  }

  public updateDescription(newDescription: TaskDescription): void {
    this._description = newDescription;
    this._updatedAt = new Date();
  }

  public updateEstimatedHours(newEstimatedHours: TaskEstimatedHours): void {
    this._estimatedHours = newEstimatedHours;
    this._updatedAt = new Date();
  }

  public updateTimeSpent(newTimeSpent: TaskTimeSpent): void {
    this._timeSpent = newTimeSpent;
    this._updatedAt = new Date();
  }

  public updateDueDate(newDueDate: TaskDueDate): void {
    this._dueDate = newDueDate;
    this._updatedAt = new Date();
  }

  public updateCost(newCost: TaskCost): void {
    this._cost = newCost;
    this._updatedAt = new Date();
  }

  public changeStatus(newStatus: TaskStatus): void {
    this._status = newStatus;
    this._updatedAt = new Date();

    // Si la tarea se marca como completada, establecer fecha de finalización
    if (newStatus.isCompleted() && !this._completionDate) {
      this._completionDate = new TaskCompletionDate(new Date());
    }
  }

  public assignUsers(newAssignedUsers: TaskAssignedUsers): void {
    this._assignedUsers = newAssignedUsers;
    this._updatedAt = new Date();
  }

  public addUser(userId: UserId): void {
    this._assignedUsers.addUser(userId);
    this._updatedAt = new Date();
  }

  public removeUser(userId: UserId): void {
    this._assignedUsers.removeUser(userId);
    this._updatedAt = new Date();
  }

  public complete(): void {
    if (!this._status.isCompleted()) {
      this.changeStatus(TaskStatus.completed());
      this._completionDate = new TaskCompletionDate(new Date());
    }
  }

  public isOverdue(): boolean {
    return this._dueDate.isOverdue() && !this._status.isCompleted();
  }

  public isCompleted(): boolean {
    return this._status.isCompleted();
  }

  public isActive(): boolean {
    return this._status.isActive();
  }

  public getEfficiencyPercentage(): number {
    if (this._estimatedHours.value === 0) return 0;
    return (this._estimatedHours.value / this._timeSpent.value) * 100;
  }

  public softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  public restore(): void {
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  // Factory method
  public static create(
    title: TaskTitle,
    description: TaskDescription,
    estimatedHours: TaskEstimatedHours,
    dueDate: TaskDueDate,
    cost: TaskCost,
    assignedUsers: TaskAssignedUsers,
    createdBy: UserId,
  ): Task {
    const task = new Task(
      TaskId.generate(),
      title,
      description,
      estimatedHours,
      new TaskTimeSpent(0),
      dueDate,
      null,
      TaskStatus.active(),
      cost,
      assignedUsers,
      createdBy,
      new Date(),
      new Date(),
    );

    return task;
  }

  // Reconstitution method
  public static reconstitute(
    id: TaskId,
    title: TaskTitle,
    description: TaskDescription,
    estimatedHours: TaskEstimatedHours,
    timeSpent: TaskTimeSpent,
    dueDate: TaskDueDate,
    completionDate: TaskCompletionDate | null,
    status: TaskStatus,
    cost: TaskCost,
    assignedUsers: TaskAssignedUsers,
    createdBy: UserId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Task {
    return new Task(
      id,
      title,
      description,
      estimatedHours,
      timeSpent,
      dueDate,
      completionDate,
      status,
      cost,
      assignedUsers,
      createdBy,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  public toPrimitives(): {
    [key: string]: string | number | string[] | undefined;
  } {
    return {
      id: this._id.value,
      title: this._title.value,
      description: this._description.value,
      estimatedHours: this._estimatedHours.value,
      timeSpent: this._timeSpent.value,
      dueDate: this._dueDate.value?.toISOString(),
      completionDate: this._completionDate?.value?.toISOString(),
      status: this._status.value.toString(),
      cost: this._cost.value,
      assignedUsers: this._assignedUsers.value.map((user) => user.value),
      createdBy: this._createdBy.value,
      createdAt: this._createdAt?.toISOString(),
      updatedAt: this._updatedAt?.toISOString(),
      deletedAt: this._deletedAt?.toISOString(),
    };
  }
}
