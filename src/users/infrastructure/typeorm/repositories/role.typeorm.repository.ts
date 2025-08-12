import { Repository } from 'typeorm';
import { RoleRepository } from '@users/domain/repositories';
import { Role as RoleModel } from '@users/infrastructure/typeorm/entities';
import { Role } from '@users/domain/entities';
import { RoleId, RoleName, RoleDescription } from '@users/domain/value-objects';
import { EntityID } from '@shared/domain/value-objects';

export class RoleRepositoryTypeorm implements RoleRepository {
  constructor(private readonly roleRepository: Repository<RoleModel>) {}

  async create(role: Role): Promise<void> {
    const roleModel = new RoleModel();
    roleModel.id = role.id.value;
    roleModel.name = role.name.value;
    roleModel.description = role.description.value;
    roleModel.created_at = role.createdAt;
    roleModel.updated_at = role.updatedAt;
    roleModel.deleted_at = role.deletedAt;

    await this.roleRepository.save(roleModel);
  }

  async findById(id: RoleId): Promise<Role | null> {
    const roleModel = await this.roleRepository.findOne({
      where: { id: id.value },
    });

    if (!roleModel) {
      return null;
    }

    return this.toDomainEntity(roleModel);
  }

  async findByName(name: RoleName): Promise<Role | null> {
    const roleModel = await this.roleRepository.findOne({
      where: { name: name.value },
    });

    if (!roleModel) {
      return null;
    }

    return this.toDomainEntity(roleModel);
  }

  async update(role: Role): Promise<void> {
    await this.roleRepository.update(role.id.value, {
      name: role.name.value,
      description: role.description.value,
      updated_at: role.updatedAt,
      deleted_at: role.deletedAt,
    });
  }

  async delete(id: RoleId): Promise<void> {
    await this.roleRepository.softDelete(id.value);
  }

  async list(): Promise<Role[]> {
    const roleModels = await this.roleRepository.find({
      order: { created_at: 'ASC' },
    });

    return roleModels.map((roleModel) => this.toDomainEntity(roleModel));
  }
  private toDomainEntity(roleModel: RoleModel): Role {
    return Role.reconstitute(
      new RoleId(roleModel.id as EntityID),
      new RoleName(roleModel.name),
      new RoleDescription(roleModel.description || ''),
      roleModel.created_at,
      roleModel.updated_at,
      roleModel.deleted_at,
    );
  }
}
