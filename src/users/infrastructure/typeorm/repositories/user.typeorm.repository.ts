import { In, Repository } from 'typeorm';
import { UserRepository } from '@users/domain/repositories';
import { User as UserModel } from '@users/infrastructure/typeorm/entities';
import { User } from '@users/domain/entities';
import {
  UserId,
  UserName,
  UserEmail,
  RoleId,
  UserFilter,
  PasswordHash,
} from '@users/domain/value-objects';
import { EntityID } from '@shared/domain/value-objects';

export class UserRepositoryTypeorm implements UserRepository {
  constructor(private readonly userRepository: Repository<UserModel>) {}

  async create(user: User): Promise<void> {
    const userModel = new UserModel();
    userModel.id = user.id.value;
    userModel.name = user.name.value;
    userModel.email = user.email.value;
    userModel.password_hash = user.passwordHash.value;
    userModel.role_id = user.roleId.value;
    userModel.created_at = user.createdAt;
    userModel.updated_at = user.updatedAt;
    userModel.deleted_at = user.deletedAt;

    await this.userRepository.save(userModel);
  }

  async getExistingEmails(emails: UserEmail[]): Promise<
    {
      email: UserEmail;
      id: UserId;
    }[]
  > {
    const userEmails = await this.userRepository.find({
      select: ['email'],
      where: { email: In(emails.map((email) => email.value)) },
    });
    return userEmails.map((userEmail) => ({
      email: new UserEmail(userEmail.email),
      id: new UserId(userEmail.id as EntityID),
    }));
  }

  async findById(id: UserId): Promise<User | null> {
    const userModel = await this.userRepository.findOne({
      where: { id: id.value },
    });

    if (!userModel) {
      return null;
    }

    return this.toDomainEntity(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userModel) {
      return null;
    }

    return this.toDomainEntity(userModel);
  }

  async update(user: User): Promise<void> {
    await this.userRepository.update(user.id.value, {
      name: user.name.value,
      email: user.email.value,
      password_hash: user.passwordHash.value,
      role_id: user.roleId.value,
      updated_at: user.updatedAt,
      deleted_at: user.deletedAt,
    });
  }

  async delete(id: UserId): Promise<void> {
    await this.userRepository.softDelete(id.value);
  }

  async list(filter: UserFilter): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filter.hasNameFilter()) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${filter.getName()}%`,
      });
    }

    if (filter.hasEmailFilter()) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${filter.getEmail()}%`,
      });
    }

    if (filter.hasRoleFilter()) {
      queryBuilder
        .leftJoin('user.role', 'role')
        .andWhere('role.name = :roleName', {
          roleName: filter.getRoleName(),
        });
    }

    queryBuilder
      .orderBy('user.created_at', 'DESC')
      .limit(filter.getLimit())
      .offset(filter.getOffset());

    const userModels = await queryBuilder.getMany();

    return userModels.map((userModel) => this.toDomainEntity(userModel));
  }

  async count(filter: UserFilter): Promise<number> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filter.hasNameFilter()) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${filter.getName()}%`,
      });
    }

    if (filter.hasEmailFilter()) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${filter.getEmail()}%`,
      });
    }

    if (filter.hasRoleFilter()) {
      queryBuilder
        .leftJoin('user.role', 'role')
        .andWhere('role.name = :roleName', {
          roleName: filter.getRoleName(),
        });
    }

    return await queryBuilder.getCount();
  }

  private toDomainEntity(userModel: UserModel): User {
    return User.reconstitute(
      new UserId(userModel.id as EntityID),
      new UserName(userModel.name),
      new UserEmail(userModel.email),
      new PasswordHash(userModel.password_hash),
      new RoleId(userModel.role_id as EntityID),
      userModel.created_at,
      userModel.updated_at,
      userModel.deleted_at,
    );
  }
}
