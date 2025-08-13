import { CreateTaskUseCase } from '@tasks/application/use-cases/create-task.use-case';
import { TASK_REPOSITORY_PROVIDER } from './task-repository.providers';
import { GetTaskUseCase } from '@tasks/application/use-cases/get-task.use-case';
import { GetTaskStatisticsUseCase } from '@tasks/application/use-cases/get-task-statistics.use-case';
import { ListTasksUseCase } from '@tasks/application/use-cases/list-tasks.use-case';
import { UpdateTaskUseCase } from '@tasks/application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '@tasks/application/use-cases/delete-task.use-case';
import { EditAssignedUsersToTaskUseCase } from '@tasks/application/use-cases/assign_task_users.use-case';
import { USER_REPOSITORY_PROVIDER } from '@users/infrastructure/providers';
import { TaskRepository } from '@tasks/domain/repositories';
import { UserRepository } from '@users/domain/repositories';

export const CREATE_TASK_USECASE = 'CREATE_TASK_USECASE';
export const GET_TASK_USECASE = 'GET_TASK_USECASE';
export const GET_TASK_STATISTICS_USECASE = 'GET_TASK_STATISTICS_USECASE';
export const LIST_TASKS_USECASE = 'LIST_TASKS_USECASE';
export const UPDATE_TASK_USECASE = 'UPDATE_TASK_USECASE';
export const DELETE_TASK_USECASE = 'DELETE_TASK_USECASE';
export const EDIT_ASSIGNED_USERS_TO_TASK_USECASE =
  'EDIT_ASSIGNED_USERS_TO_TASK_USECASE';

export const createTaskUseCaseProvider = {
  provide: CREATE_TASK_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new CreateTaskUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const getTaskUseCaseProvider = {
  provide: GET_TASK_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new GetTaskUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const getTaskStatisticsUseCaseProvider = {
  provide: GET_TASK_STATISTICS_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new GetTaskStatisticsUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const listTasksUseCaseProvider = {
  provide: LIST_TASKS_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new ListTasksUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const updateTaskUseCaseProvider = {
  provide: UPDATE_TASK_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new UpdateTaskUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const deleteTaskUseCaseProvider = {
  provide: DELETE_TASK_USECASE,
  useFactory: (taskRepository: TaskRepository) => {
    return new DeleteTaskUseCase(taskRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER],
};

export const editAssignedUsersToTaskUseCaseProvider = {
  provide: EDIT_ASSIGNED_USERS_TO_TASK_USECASE,
  useFactory: (
    taskRepository: TaskRepository,
    userRepository: UserRepository,
  ) => {
    return new EditAssignedUsersToTaskUseCase(taskRepository, userRepository);
  },
  inject: [TASK_REPOSITORY_PROVIDER, USER_REPOSITORY_PROVIDER],
};
