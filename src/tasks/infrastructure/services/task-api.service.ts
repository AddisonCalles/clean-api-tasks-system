import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '@tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/use-cases/delete-task.use-case';
import type { TaskFilterCriteria } from '@tasks/domain/entities';
import { TaskFilter, TaskId } from '@tasks/domain/value-objects';
import { UserId } from '@users/domain/value-objects';
import {
  CREATE_TASK_USECASE,
  DELETE_TASK_USECASE,
  GET_TASK_STATISTICS_USECASE,
  GET_TASK_USECASE,
  LIST_TASKS_USECASE,
  UPDATE_TASK_USECASE,
} from '../providers/task-usecases.providers';
import { GetTaskUseCase } from '@tasks/application/use-cases/get-task.use-case';
import { ListTasksUseCase } from '@tasks/application/use-cases/list-tasks.use-case';
import { GetTaskStatisticsUseCase } from '@tasks/application/use-cases/get-task-statistics.use-case';
import type {
  GetTaskResponse,
  ListTasksResponse,
  CreateTaskResponse,
  UpdateTaskResponse,
  GetTaskStatisticsResponse,
} from '@tasks/application/outputs';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@tasks/application/inputs';
import { HandleDomainExceptions } from '@shared/infrastructure/exception.validator';
import { EntityID } from '@shared/domain/value-objects';

@Injectable()
export class TaskAPIService {
  constructor(
    @Inject(CREATE_TASK_USECASE)
    private createTaskUseCase: CreateTaskUseCase,
    @Inject(DELETE_TASK_USECASE)
    private deleteTaskUseCase: DeleteTaskUseCase,
    @Inject(GET_TASK_USECASE)
    private getTaskUseCase: GetTaskUseCase,
    @Inject(GET_TASK_STATISTICS_USECASE)
    private getTaskStatisticsUseCase: GetTaskStatisticsUseCase,
    @Inject(LIST_TASKS_USECASE)
    private listTasksUseCase: ListTasksUseCase,
    @Inject(UPDATE_TASK_USECASE)
    private updateTaskUseCase: UpdateTaskUseCase,
  ) {}

  @HandleDomainExceptions
  async getByTaskId(taskId: string): Promise<GetTaskResponse | null> {
    return this.getTaskUseCase.execute(new TaskId(taskId));
  }

  @HandleDomainExceptions
  async getListTasks(filter?: TaskFilterCriteria): Promise<ListTasksResponse> {
    const taskFilter = filter ? new TaskFilter(filter) : TaskFilter.empty();
    return this.listTasksUseCase.execute(taskFilter);
  }

  @HandleDomainExceptions
  async createTask(
    createTaskRequest: CreateTaskRequest,
  ): Promise<CreateTaskResponse> {
    return this.createTaskUseCase.execute(createTaskRequest);
  }

  @HandleDomainExceptions
  async updateTask(
    taskId: string,
    updateTaskRequest: UpdateTaskRequest,
  ): Promise<UpdateTaskResponse | null> {
    return this.updateTaskUseCase.execute(
      new TaskId(taskId),
      updateTaskRequest,
    );
  }

  @HandleDomainExceptions
  async deleteTask(taskId: string): Promise<void> {
    return this.deleteTaskUseCase.execute(new TaskId(taskId));
  }

  @HandleDomainExceptions
  async getTaskStatistics(userId?: string): Promise<GetTaskStatisticsResponse> {
    const userIdValueObject = userId
      ? new UserId(userId as EntityID)
      : undefined;
    return this.getTaskStatisticsUseCase.execute(userIdValueObject);
  }
}
