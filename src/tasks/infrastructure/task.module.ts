import { Module } from '@nestjs/common';
import { TaskAPIService } from './services/task-api.service';
import { TaskController } from './apis/task.controller';
import {
  createTaskUseCaseProvider,
  getTaskUseCaseProvider,
  getTaskStatisticsUseCaseProvider,
  listTasksUseCaseProvider,
  updateTaskUseCaseProvider,
  deleteTaskUseCaseProvider,
  taskRepositoryProvider,
  completeTaskUseCaseProvider,
  editAssignedUsersToTaskUseCaseProvider,
} from '@tasks/infrastructure/providers';
import { DatabaseModule } from '@shared/infrastructure/database.module';
import { AuthModule } from '@auth/infrastructure/auth.module';

import { UserExportsModule } from '@users/infrastructure/user.exports.module';
import TaskStatisticsController from './apis/task-statistics.controller';
import { TaskStatisticsService } from './services/task-statistics.service';

@Module({
  imports: [DatabaseModule, AuthModule, UserExportsModule],
  controllers: [TaskController, TaskStatisticsController],
  providers: [
    TaskAPIService,
    TaskStatisticsService,
    createTaskUseCaseProvider,
    getTaskUseCaseProvider,
    getTaskStatisticsUseCaseProvider,
    listTasksUseCaseProvider,
    editAssignedUsersToTaskUseCaseProvider,
    updateTaskUseCaseProvider,
    deleteTaskUseCaseProvider,
    taskRepositoryProvider,
    completeTaskUseCaseProvider,
  ],
})
export class TaskModule {}
