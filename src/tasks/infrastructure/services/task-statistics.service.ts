import { Inject, Injectable } from '@nestjs/common';
import type { TaskRepository } from '@tasks/domain/repositories';
import { TASK_REPOSITORY_PROVIDER } from '../providers/task-repository.providers';
import { EntityID } from '@shared/domain/value-objects';
import { UserId } from '@users/domain/value-objects';

@Injectable()
export class TaskStatisticsService {
  constructor(
    @Inject(TASK_REPOSITORY_PROVIDER)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getTaskStatistics() {
    return this.taskRepository.getTaskStatistics();
  }

  async getUserTasksStatistics(userId: string) {
    const userIdValueObject = new UserId(userId as EntityID);
    return this.taskRepository.getUserTaskStatistics(userIdValueObject);
  }
}
