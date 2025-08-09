import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { TaskNotFoundException } from '@tasks/domain/exceptions';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(taskId: TaskId): Promise<void> {
    // Verificar si la tarea existe
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new TaskNotFoundException(taskId.value);
    }

    await this.taskRepository.delete(taskId);
  }
}
