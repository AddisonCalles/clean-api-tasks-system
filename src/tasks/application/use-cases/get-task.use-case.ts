import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { GetTaskResponse } from '@tasks/application/outputs/get-task.response.dto';
import { TaskNotFoundException } from '@tasks/domain/exceptions';

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(taskId: TaskId): Promise<GetTaskResponse | null> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException(taskId.value);
    }

    return new GetTaskResponse(
      task.id.value,
      task.title.value,
      task.description.value,
      task.estimatedHours.value,
      task.timeSpent.value,
      task.dueDate.value,
      task.completionDate?.value || null,
      task.status.value,
      task.cost.value,
      task.assignedUsers.value.map((user) => user.value),
      task.createdBy.value,
      task.createdAt,
      task.updatedAt,
      task.isOverdue(),
      task.getEfficiencyPercentage(),
    );
  }
}
