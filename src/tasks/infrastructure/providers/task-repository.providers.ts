import { DataSource } from 'typeorm';
import { TaskRepositoryTypeorm } from '@tasks/infrastructure/typeorm/repositories';
import { Task } from '../typeorm/entities';

export const TASK_REPOSITORY_PROVIDER = 'TASK_REPOSITORY';
export const taskRepositoryProvider = {
  provide: TASK_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new TaskRepositoryTypeorm(dataSource.getRepository(Task));
  },
  inject: [process.env.DATA_SOURCE!],
};
