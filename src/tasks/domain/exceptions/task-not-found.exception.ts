import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

export class TaskNotFoundException extends EntityNotFoundException {
  constructor(taskId: string) {
    super(`Task with ID ${taskId} not found`);
  }
}
