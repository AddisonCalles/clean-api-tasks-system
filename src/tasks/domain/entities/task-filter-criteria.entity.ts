import { TaskStatus } from '../value-objects';
import { UserId } from '@users/domain/value-objects';

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
