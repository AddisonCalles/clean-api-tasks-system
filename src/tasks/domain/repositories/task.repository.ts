import { Task } from '@tasks/domain/entities';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { TaskStatistics } from '@tasks/domain/entities';
import { UserId } from '@tasks/domain/value-objects/user-id.value-object';
import { TaskFilter } from '@tasks/domain/value-objects/task-filter.value-object';

export interface TaskRepository {
  create(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  delete(id: TaskId): Promise<void>;
  getUserTaskStatistics(userId: UserId): Promise<TaskStatistics>;
  listTasks(request: TaskFilter): Promise<Task[]>;
  getTaskStatistics(): Promise<TaskStatistics>;
  update(task: Task): Promise<void>;
}
