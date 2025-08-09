import { TaskStatus, UserId } from '../value-objects';

export interface TaskFilterCriteria {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedUserId?: UserId;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdBy?: UserId;
  isOverdue?: boolean;
  isCompleted?: boolean;
}
