import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { TaskTitle } from '@tasks/domain/value-objects/task-title.value-object';
import { TaskDescription } from '@tasks/domain/value-objects/task-description.value-object';
import { TaskEstimatedHours } from '@tasks/domain/value-objects/task-estimated-hours.value-object';
import { TaskDueDate } from '@tasks/domain/value-objects/task-due-date.value-object';
import { TaskCost } from '@tasks/domain/value-objects/task-cost.value-object';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.value-object';
import { TaskAssignedUsers } from '@tasks/domain/value-objects/task-assigned-users.value-object';
import { UpdateTaskRequest } from '@tasks/application/inputs/update-task.request.dto';
import { UpdateTaskResponse } from '@tasks/application/outputs/update-task.response.dto';
import { TaskTimeSpent } from '@tasks/domain/value-objects';
import { TaskNotFoundException } from '@tasks/domain/exceptions';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(
    taskId: TaskId,
    request: UpdateTaskRequest,
  ): Promise<UpdateTaskResponse | null> {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException(taskId.value);
    }

    // Actualizar campos si se proporcionan
    if (request.title !== undefined) {
      const title = new TaskTitle(request.title);
      task.updateTitle(title);
    }

    if (request.description !== undefined) {
      const description = new TaskDescription(request.description);
      task.updateDescription(description);
    }

    if (request.estimatedHours !== undefined) {
      const estimatedHours = new TaskEstimatedHours(request.estimatedHours);
      task.updateEstimatedHours(estimatedHours);
    }

    if (request.timeSpent !== undefined) {
      const timeSpent = new TaskTimeSpent(request.timeSpent);
      task.updateTimeSpent(timeSpent);
    }

    if (request.dueDate !== undefined) {
      const dueDate = new TaskDueDate(request.dueDate);
      task.updateDueDate(dueDate);
    }

    if (request.status !== undefined) {
      const status = TaskStatus.fromString(request.status);
      task.changeStatus(status);
    }

    if (request.cost !== undefined) {
      const cost = new TaskCost(request.cost);
      task.updateCost(cost);
    }

    if (request.assignedUserIds !== undefined) {
      const assignedUsers = TaskAssignedUsers.createFromStrings(
        request.assignedUserIds,
      );
      task.assignUsers(assignedUsers);
    }

    // TODO: Guardar cambios cuando el repositorio tenga el método
    await this.taskRepository.update(task);

    // Retornar respuesta actualizada
    return new UpdateTaskResponse(
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
