import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskFilterCriteria } from '@tasks/domain/entities';

export class TaskFilter extends ValueObject<TaskFilterCriteria> {
  constructor(value: TaskFilterCriteria) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: TaskFilterCriteria): void {
    if (value.dueDateFrom && value.dueDateTo) {
      if (value.dueDateFrom > value.dueDateTo) {
        throw new Error('Due date from cannot be after due date to');
      }
    }
  }

  public hasTitleFilter(): boolean {
    return !!this.value.title;
  }

  public hasStatusFilter(): boolean {
    return !!this.value.status;
  }

  public hasAssignedUserFilter(): boolean {
    return !!this.value.assignedUserId;
  }

  public hasDateRangeFilter(): boolean {
    return !!(this.value.dueDateFrom || this.value.dueDateTo);
  }

  public hasOverdueFilter(): boolean {
    return this.value.isOverdue === true;
  }

  public hasCompletedFilter(): boolean {
    return this.value.isCompleted === true;
  }

  public hasCreatedByFilter(): boolean {
    return !!this.value.createdBy;
  }

  public isEmpty(): boolean {
    return (
      !this.value.title &&
      !this.value.description &&
      !this.value.status &&
      !this.value.assignedUserId &&
      !this.value.dueDateFrom &&
      !this.value.dueDateTo &&
      !this.value.createdBy &&
      this.value.isOverdue === undefined &&
      this.value.isCompleted === undefined
    );
  }

  public static create(criteria: TaskFilterCriteria): TaskFilter {
    return new TaskFilter(criteria);
  }

  public static empty(): TaskFilter {
    return new TaskFilter({});
  }
}
