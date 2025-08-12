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

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [TaskController],
  providers: [
    TaskAPIService,
    createTaskUseCaseProvider,
    getTaskUseCaseProvider,
    getTaskStatisticsUseCaseProvider,
    listTasksUseCaseProvider,
    updateTaskUseCaseProvider,
    deleteTaskUseCaseProvider,
    taskRepositoryProvider,
  ],
})
export class TaskModule {}
