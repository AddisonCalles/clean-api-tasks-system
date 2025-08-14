import { Task } from '@tasks/domain/entities';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { TaskStatistics } from '@tasks/domain/entities';
import { TaskFilter } from '@tasks/domain/value-objects/task-filter.value-object';
import { UserId } from '@users/domain/value-objects';

export interface TaskRepository {
  create(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  delete(id: TaskId): Promise<void>;
  getUserTaskStatistics(userId: UserId): Promise<TaskStatistics>;
  listTasks(request: TaskFilter): Promise<Task[]>;
  getTaskStatistics(): Promise<TaskStatistics>;
  update(task: Task): Promise<void>;
  assignUsersToTask(taskId: TaskId, userIds: string[]): Promise<void>;
}
