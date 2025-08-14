import { DataSource } from 'typeorm';
import { TaskRepositoryTypeorm } from '@tasks/infrastructure/typeorm/repositories';
import { Task } from '../typeorm/entities';
import { User } from '@users/infrastructure/typeorm/entities';

export const TASK_REPOSITORY_PROVIDER = 'TASK_REPOSITORY';
export const taskRepositoryProvider = {
  provide: TASK_REPOSITORY_PROVIDER,
  useFactory: (dataSource: DataSource) => {
    return new TaskRepositoryTypeorm(
      dataSource.getRepository(Task),
      dataSource.getRepository(User),
    );
  },
  inject: [process.env.DATA_SOURCE!],
};
