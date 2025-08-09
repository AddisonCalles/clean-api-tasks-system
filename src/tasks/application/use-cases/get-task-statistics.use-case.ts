import { UserId } from '@tasks/domain/value-objects';
import type { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { GetTaskStatisticsResponse } from '@tasks/application/outputs';

export class GetTaskStatisticsUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async execute(userId?: UserId): Promise<GetTaskStatisticsResponse> {
    if (userId) {
      // Estadísticas específicas del usuario
      const userStats = await this.taskRepository.getUserTaskStatistics(userId);

      return {
        statistics: {
          totalTasks: userStats.totalTasks,
          completedTasks: userStats.completedTasks,
          overdueTasks: 0, // Se calcularía específicamente para el usuario
          activeTasks: userStats.totalTasks - userStats.completedTasks,
          totalCost: userStats.totalCost,
          efficiencyPercentage:
            userStats.completedTasks > 0
              ? (userStats.completedTasks / userStats.totalTasks) * 100
              : 0,
        },
        userId: userId.value,
      };
    } else {
      // Estadísticas generales del sistema
      const stats = await this.taskRepository.getTaskStatistics();

      return {
        statistics: {
          totalTasks: stats.totalTasks,
          completedTasks: stats.completedTasks,
          overdueTasks: stats.overdueTasks,
          activeTasks: stats.activeTasks,
          totalCost: 0, // Se calcularía sumando todos los costos
          efficiencyPercentage:
            stats.totalTasks > 0
              ? (stats.completedTasks / stats.totalTasks) * 100
              : 0,
        },
      };
    }
  }
}
