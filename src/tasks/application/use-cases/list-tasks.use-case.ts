import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskFilter } from '@tasks/domain/value-objects/task-filter.value-object';
import { ListTasksResponse } from '@tasks/application/outputs';
import { TaskListItem } from '../outputs/list-tasks.response.dto';

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(filter: TaskFilter): Promise<ListTasksResponse> {
    const tasks = await this.taskRepository.listTasks(filter);

    const taskListItems: TaskListItem[] = tasks.map((task) => ({
      id: task.id.value,
      title: task.title.value,
      description: task.description.value,
      estimatedHours: task.estimatedHours.value,
      timeSpent: task.timeSpent.value,
      dueDate: task.dueDate.value,
      completionDate: task.completionDate?.value || null,
      status: task.status.value,
      cost: task.cost.value,
      assignedUsers: task.assignedUsers.value,
      createdBy: task.createdBy.value,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      isOverdue: task.isOverdue(),
      efficiencyPercentage: task.getEfficiencyPercentage(),
    }));

    return {
      tasks: taskListItems,
      total: taskListItems.length,
    };
  }
}
