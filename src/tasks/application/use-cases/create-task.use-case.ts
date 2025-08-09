import { Task } from '@tasks/domain/entities/task.entity';
import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import {
  TaskTitle,
  TaskDescription,
  TaskEstimatedHours,
  TaskDueDate,
  TaskCost,
  TaskAssignedUsers,
  UserId,
} from '@tasks/domain/value-objects';
import { CreateTaskResponse } from '@tasks/application/outputs/create-task.response.dto';
import { CreateTaskRequest } from '@tasks/application/inputs/create-task.request.dto';
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(
    request: CreateTaskRequest,
  ): Promise<CreateTaskResponse> {
    // Validar y crear value objects
    const title = new TaskTitle(request.title);
    const description = new TaskDescription(request.description);
    const estimatedHours = new TaskEstimatedHours(request.estimatedHours);
    const dueDate = new TaskDueDate(request.dueDate);
    const cost = new TaskCost(request.cost);
    const assignedUsers = TaskAssignedUsers.createFromStrings(
      request.assignedUserIds,
    );
    const createdBy = new UserId(request.createdBy);

    // Crear la tarea usando el factory method
    const task = Task.create(
      title,
      description,
      estimatedHours,
      dueDate,
      cost,
      assignedUsers,
      createdBy,
    );

    // Guardar la tarea
    await this.taskRepository.create(task);

    // Retornar respuesta
    return new CreateTaskResponse(
      task.id.value,
      task.title.value,
      task.description.value,
      task.estimatedHours.value,
      task.dueDate.value,
      task.cost.value,
      task.assignedUsers.value.map((user) => user.value),
      task.createdBy.value,
      task.createdAt,
    );
  }
}
