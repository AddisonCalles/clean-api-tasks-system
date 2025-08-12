import type { User } from '@users/domain/entities';
import type { UserId, UserFilter } from '@users/domain/value-objects';

export interface UserRepository {
  create(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  list(filter: UserFilter): Promise<User[]>;
  count(filter: UserFilter): Promise<number>;
}
