import { UserRepository } from '@users/domain/repositories';
import { UserId } from '@users/domain/value-objects';
import { UserNotFoundException } from '@users/domain/exceptions';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(userId: UserId): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId.value);
    }

    // Soft delete
    user.markAsDeleted();

    // Guardar cambios
    await this.userRepository.update(user);
  }
}
