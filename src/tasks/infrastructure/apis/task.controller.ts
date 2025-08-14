import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskAPIService } from '../services/task-api.service';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@tasks/application/inputs';
import type { TaskFilterCriteria } from '@tasks/domain/entities';
import {
  RequiredCreateTaskPermissions,
  RequiredViewAllTasksPermissions,
  RequiredUpdateTaskPermissions,
  RequiredViewTaskPermissions,
  RequiredAssignUsersTaskPermissions,
  RequiredCompleteTaskPermissions,
} from '../decorators/task.decorator';
import { PermissionGuard } from '@auth/infrastructure/guards';
import type { UpdateTaskUsersRequest } from '@tasks/application/inputs';
import { UserSession } from '@auth/domain/entities/user-session.entity';

@UseGuards(PermissionGuard)
@Controller()
export class TaskController {
  constructor(private readonly taskAPIService: TaskAPIService) {}

  @Get('tasks')
  @RequiredViewAllTasksPermissions()
  getListTasks(@Query() filter?: TaskFilterCriteria) {
    return this.taskAPIService.getListTasks(filter);
  }

  @Post('tasks')
  @RequiredCreateTaskPermissions()
  createTask(
    @Body() createTaskRequest: CreateTaskRequest,
    @Request() request: { userSession: UserSession },
  ) {
    return this.taskAPIService.createTask(
      createTaskRequest,
      request.userSession,
    );
  }

  @Get('tasks/:id')
  @RequiredViewTaskPermissions()
  getTask(@Param('id') id: string) {
    return this.taskAPIService.getByTaskId(id);
  }

  @Put('tasks/:id')
  @RequiredUpdateTaskPermissions()
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskRequest: UpdateTaskRequest,
  ) {
    return this.taskAPIService.updateTask(id, updateTaskRequest);
  }

  @Patch('tasks/:id/users')
  @RequiredAssignUsersTaskPermissions()
  updateTaskUsers(
    @Param('id') id: string,
    @Body() updateTaskUsersRequest: UpdateTaskUsersRequest,
  ) {
    return this.taskAPIService.updateTaskUsers(id, updateTaskUsersRequest);
  }

  @Patch('tasks/:id/complete')
  @RequiredCompleteTaskPermissions()
  completeTask(@Param('id') id: string) {
    return this.taskAPIService.completeTask(id);
  }
}
