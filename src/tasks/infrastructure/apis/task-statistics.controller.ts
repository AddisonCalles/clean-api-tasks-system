import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RequiredViewTaskStatisticsPermissions } from '../decorators/task-statistics.decorator';
import { TaskStatisticsService } from '../services/task-statistics.service';
import { PermissionGuard } from '@auth/infrastructure/guards';

@UseGuards(PermissionGuard)
@Controller('statistics')
class TaskStatisticsController {
  constructor(private readonly taskStatisticsService: TaskStatisticsService) {}

  @Get('tasks')
  @RequiredViewTaskStatisticsPermissions()
  getTaskStatistics() {
    return this.taskStatisticsService.getTaskStatistics();
  }

  @Get('tasks/user/:userId')
  @RequiredViewTaskStatisticsPermissions()
  getUserTaskStatistics(@Param('userId') userId: string) {
    return this.taskStatisticsService.getUserTasksStatistics(userId);
  }
}

export default TaskStatisticsController;
