import { Module } from '@nestjs/common';
import { TaskAPIService } from './services/task-api.service';
import { TaskController } from './apis/task.controller';
import { taskRepositoryProviders } from '@tasks/infrastructure/providers/task-repository.providers';
import { DatabaseModule } from '@shared/infrastructure/nestjs/database.module';
import { taskUseCaseProviders } from './providers/task-usecases.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    TaskAPIService,
    ...taskRepositoryProviders,
    ...taskUseCaseProviders,
  ],
})
export class TaskModule {}
