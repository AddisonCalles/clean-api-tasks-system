import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TaskAPIService } from '../services/task-api.service';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@tasks/application/inputs';
import type { TaskFilterCriteria } from '@tasks/domain/entities';

@Controller()
export class TaskController {
  constructor(private readonly taskAPIService: TaskAPIService) {}

  @Get('tasks')
  getListTasks(@Query() filter?: TaskFilterCriteria) {
    return this.taskAPIService.getListTasks(filter);
  }

  @Post('tasks')
  createTask(@Body() createTaskRequest: CreateTaskRequest) {
    return this.taskAPIService.createTask(createTaskRequest);
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string) {
    return this.taskAPIService.getByTaskId(id);
  }

  @Put('tasks/:id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskRequest: UpdateTaskRequest,
  ) {
    return this.taskAPIService.updateTask(id, updateTaskRequest);
  }
}
