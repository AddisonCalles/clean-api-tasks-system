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
} from '@tasks/infrastructure/providers';
import { DatabaseModule } from '@shared/infrastructure/database.module';
import { AuthModule } from '@auth/infrastructure/auth.module';
import { editAssignedUsersToTaskUseCaseProvider } from './providers/task-usecases.providers';
import { UserExportsModule } from '@users/infrastructure/user.exports.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserExportsModule],
  controllers: [TaskController],
  providers: [
    TaskAPIService,
    createTaskUseCaseProvider,
    getTaskUseCaseProvider,
    getTaskStatisticsUseCaseProvider,
    listTasksUseCaseProvider,
    editAssignedUsersToTaskUseCaseProvider,
    updateTaskUseCaseProvider,
    deleteTaskUseCaseProvider,
    taskRepositoryProvider,
  ],
})
export class TaskModule {}
