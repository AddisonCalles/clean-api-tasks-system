import { TaskNotFoundException } from '@tasks/domain/exceptions';
import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskId } from '@tasks/domain/value-objects';

export class CompleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(taskId: TaskId): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new TaskNotFoundException(taskId.value);
    }

    task.complete();
    await this.taskRepository.update(task);
  }
}
