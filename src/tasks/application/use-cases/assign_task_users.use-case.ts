import { TaskRepository } from '@tasks/domain/repositories/task.repository';
import { TaskId } from '@tasks/domain/value-objects/task-id.value-object';
import { UserEmail } from '@users/domain/value-objects';
import { TaskAssignedUsers } from '@tasks/domain/value-objects/task-assigned-users.value-object';
import { TaskNotFoundException } from '@tasks/domain/exceptions';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { UserNotFoundException } from '@users/domain/exceptions';

export class EditAssignedUsersToTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(taskId: TaskId, userEmails: UserEmail[]) {
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new TaskNotFoundException(taskId.value);
    }

    const usersExist = await this.userRepository.getExistingEmails(userEmails);

    if (usersExist.length !== userEmails.length) {
      throw new UserNotFoundException(
        userEmails
          .filter((email) => !usersExist.some((user) => user.email === email))
          .map((email) => email.value)
          .join(', '),
      );
    }

    const assignedUsers = new TaskAssignedUsers(
      usersExist.map((user) => user.id),
    );
    task.assignUsers(assignedUsers);
    await this.taskRepository.update(task);
  }
}
