import { Repository } from 'typeorm';
import { PermissionRepository } from '@users/domain/repositories';
import { Permission as PermissionModel } from '@users/infrastructure/typeorm/entities';
import { Permission } from '@users/domain/entities';
import {
  PermissionId,
  PermissionName,
  PermissionDescription,
} from '@users/domain/value-objects';

export class PermissionRepositoryTypeorm implements PermissionRepository {
  constructor(
    private readonly permissionRepository: Repository<PermissionModel>,
  ) {}

  async create(permission: Permission): Promise<void> {
    const permissionModel = new PermissionModel();
    permissionModel.id = permission.id.value;
    permissionModel.name = permission.name.value;
    permissionModel.description = permission.description.value;
    permissionModel.created_at = permission.createdAt;
    permissionModel.updated_at = permission.updatedAt;
    permissionModel.deleted_at = permission.deletedAt;

    await this.permissionRepository.save(permissionModel);
  }

  async findById(id: PermissionId): Promise<Permission | null> {
    const permissionModel = await this.permissionRepository.findOne({
      where: { id: id.value },
    });

    if (!permissionModel) {
      return null;
    }

    return this.toDomainEntity(permissionModel);
  }

  async findByName(name: PermissionName): Promise<Permission | null> {
    const permissionModel = await this.permissionRepository.findOne({
      where: { name: name.value },
    });

    if (!permissionModel) {
      return null;
    }

    return this.toDomainEntity(permissionModel);
  }

  async update(permission: Permission): Promise<void> {
    await this.permissionRepository.update(permission.id.value, {
      name: permission.name.value,
      description: permission.description.value,
      updated_at: permission.updatedAt,
      deleted_at: permission.deletedAt,
    });
  }

  async delete(id: PermissionId): Promise<void> {
    await this.permissionRepository.softDelete(id.value);
  }

  async list(): Promise<Permission[]> {
    const permissionModels = await this.permissionRepository.find({
      order: { name: 'ASC' },
    });

    return permissionModels.map((permissionModel) =>
      this.toDomainEntity(permissionModel),
    );
  }

  private toDomainEntity(permissionModel: PermissionModel): Permission {
    return Permission.reconstitute(
      new PermissionId(permissionModel.id),
      new PermissionName(permissionModel.name),
      new PermissionDescription(permissionModel.description || ''),
      permissionModel.created_at,
      permissionModel.updated_at,
      permissionModel.deleted_at,
    );
  }
}
