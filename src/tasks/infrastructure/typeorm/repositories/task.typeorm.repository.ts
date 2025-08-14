import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import {
  Between,
  FindOperator,
  IsNull,
  LessThan,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { Task as TaskModel } from '@tasks/infrastructure/typeorm/entities';
import { User } from '@users/infrastructure/typeorm/entities';
import { Task, TaskStatistics } from '@tasks/domain/entities';
import {
  TaskFilter,
  TaskId,
  TaskDescription,
  TaskTitle,
  TaskEstimatedHours,
  TaskTimeSpent,
  TaskCompletionDate,
  TaskStatus,
  TaskCost,
  TaskAssignedUsers,
  TaskDueDate,
} from '@tasks/domain/value-objects';
import { UserId } from '@users/domain/value-objects';
import { EntityID } from '@shared/domain/value-objects';

export class TaskRepositoryTypeorm implements TaskRepository {
  constructor(
    private readonly taskRepository: Repository<TaskModel>,
    private readonly userRepository: Repository<User>,
  ) {}

  async create(task: Task): Promise<void> {
    const taskModel = new TaskModel();
    taskModel.id = task.id.value;
    taskModel.title = task.title.value;
    taskModel.description = task.description.value;
    taskModel.estimated_hours = task.estimatedHours.value;
    taskModel.time_spent = task.timeSpent.value;
    taskModel.due_date = task.dueDate.value;
    taskModel.completion_date = task.completionDate?.value || null;
    taskModel.status = task.status.value;
    taskModel.cost = task.cost.value;
    taskModel.created_by = task.createdBy.value;
    taskModel.created_at = task.createdAt;
    taskModel.updated_at = task.updatedAt;
    taskModel.deleted_at = task.deletedAt;
    await this.taskRepository.save(taskModel);
  }

  async findById(id: TaskId): Promise<Task | null> {
    const taskModel = await this.taskRepository.findOne({
      where: { id: id.value },
    });

    if (!taskModel) return null;

    // Cargar usuarios asignados manualmente usando SQL directo
    const taskUsers = await this.taskRepository.manager.query(`
      SELECT tu.*, u.email 
      FROM tasks.task_users tu 
      LEFT JOIN users.users u ON tu.user_id = u.id 
      WHERE tu.task_id = $1
    `, [id.value]);

    return this.mapTaskModelToTask(taskModel, taskUsers);
  }

  async delete(id: TaskId): Promise<void> {
    await this.taskRepository.update(id.value, { deleted_at: new Date() });
  }

  async getUserTaskStatistics(userId: UserId): Promise<TaskStatistics> {
    const tasksResult = await this.taskRepository.find({
      where: { created_by: userId.value },
    });
    const tasks = tasksResult.map((taskModel) =>
      this.mapTaskModelToTask(taskModel),
    );
    return this.calculateTaskStatistics(tasks);
  }

  async listTasks(filter: TaskFilter): Promise<Task[]> {
    const whereClause: {
      [key: string]: string | FindOperator<any> | undefined | Date | null;
    } = {};

    if (filter.hasStatusFilter()) {
      whereClause.status = filter.value.status?.value;
    }

    if (filter.hasAssignedUserFilter()) {
      whereClause.createdBy = filter.value.assignedUserId?.value;
    }

    if (filter.hasDateRangeFilter()) {
      if (filter.value.dueDateFrom && filter.value.dueDateTo) {
        whereClause.dueDate = Between(
          filter.value.dueDateFrom?.toISOString() || '',
          filter.value.dueDateTo?.toISOString() || '',
        );
      } else if (filter.value.dueDateFrom) {
        whereClause.dueDate = MoreThan(
          filter.value.dueDateFrom?.toISOString() || '',
        );
      } else if (filter.value.dueDateTo) {
        whereClause.dueDate = LessThan(
          filter.value.dueDateTo?.toISOString() || '',
        );
      }
    }

    if (filter.hasCompletedFilter()) {
      whereClause.completionDate = Not(IsNull());
    }

    if (filter.hasCreatedByFilter()) {
      whereClause.createdBy = filter.value.createdBy?.value;
    }

    const taskModels = await this.taskRepository.find({
      where: whereClause,
    });

    // Cargar usuarios asignados para todas las tareas usando SQL directo
    const taskIds = taskModels.map((task) => task.id);
    let allTaskUsers: any[] = [];

    if (taskIds.length > 0) {
      const placeholders = taskIds.map((_, index) => `$${index + 1}`).join(',');
      allTaskUsers = await this.taskRepository.manager.query(`
        SELECT tu.*, u.email 
        FROM tasks.task_users tu 
        LEFT JOIN users.users u ON tu.user_id = u.id 
        WHERE tu.task_id IN (${placeholders})
      `, taskIds);
    }

    return taskModels.map((taskModel) => {
      const taskUsers = allTaskUsers.filter(tu => tu.task_id === taskModel.id);
      return this.mapTaskModelToTask(taskModel, taskUsers);
    });
  }

  async getTaskStatistics(): Promise<TaskStatistics> {
    const tasksResult = await this.taskRepository.find({
      where: { status: TaskStatus.active().value },
    });

    const tasks = tasksResult.map((taskModel) =>
      this.mapTaskModelToTask(taskModel),
    );

    return this.calculateTaskStatistics(tasks);
  }

  private calculateTaskStatistics(tasks: Task[]): TaskStatistics {
    return {
      totalTasks: tasks.length,
      activeTasks: tasks.filter((task) => task.status.isActive()).length,
      completedTasks: tasks.filter((task) => task.status.isCompleted()).length,
      overdueTasks: tasks.filter((task) => task.isOverdue()).length,
      totalCost: tasks.reduce((acc, task) => acc + task.cost.value, 0),
      efficiencyPercentage:
        tasks.reduce((acc, task) => acc + task.getEfficiencyPercentage(), 0) /
        tasks.length,
    };
  }
  async update(task: Task): Promise<void> {
    const taskModel = new TaskModel();
    taskModel.id = task.id.value;
    taskModel.title = task.title.value;
    taskModel.description = task.description.value;
    taskModel.estimated_hours = task.estimatedHours.value;
    taskModel.time_spent = task.timeSpent.value;
    taskModel.due_date = task.dueDate.value;
    taskModel.completion_date = task.completionDate?.value || null;
    taskModel.status = task.status.value;
    taskModel.cost = task.cost.value;
    taskModel.created_by = task.createdBy.value;
    taskModel.created_at = task.createdAt;
    taskModel.updated_at = task.updatedAt;
    await this.taskRepository.save(taskModel);
  }

  async assignUsersToTask(taskId: TaskId, userIds: string[]): Promise<void> {
    // Primero eliminar todas las asignaciones existentes usando SQL directo
    await this.taskRepository.manager.query(
      'DELETE FROM tasks.task_users WHERE task_id = $1',
      [taskId.value],
    );

    // Luego insertar las nuevas asignaciones usando SQL directo
    if (userIds.length > 0) {
      const values = userIds
        .map(
          (_, index) =>
            `($1, $${index + 2}, $${userIds.length + 2}, $${userIds.length + 3})`,
        )
        .join(', ');

      const params = [
        taskId.value,
        ...userIds,
        new Date(),
        new Date(),
      ];

      await this.taskRepository.manager.query(
        `INSERT INTO tasks.task_users (task_id, user_id, created_at, updated_at) VALUES ${values}`,
        params,
      );
    }
  }

  private mapTaskModelToTask(taskModel: TaskModel, taskUsers?: any[]): Task {
    const assignedUsers = taskUsers?.map((taskUser) => ({
      userId: taskUser.user_id,
      email: taskUser.email || '',
      assignedAt: taskUser.created_at,
    })) || [];

    return Task.reconstitute(
      new TaskId(taskModel.id),
      new TaskTitle(taskModel.title),
      new TaskDescription(taskModel.description),
      new TaskEstimatedHours(taskModel.estimated_hours),
      new TaskTimeSpent(taskModel.time_spent),
      new TaskDueDate(taskModel.due_date),
      taskModel.completion_date
        ? new TaskCompletionDate(taskModel.completion_date)
        : null,
      new TaskStatus(taskModel.status),
      new TaskCost(taskModel.cost),
      new TaskAssignedUsers(assignedUsers),
      new UserId(taskModel.created_by as EntityID),
      taskModel.created_at,
      taskModel.updated_at,
      taskModel.deleted_at,
    );
  }
}
