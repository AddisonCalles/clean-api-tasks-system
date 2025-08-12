import { Role } from '@users/domain/entities';
import { RoleId, RoleName } from '@users/domain/value-objects';

export interface RoleRepository {
  create(role: Role): Promise<void>;
  findById(id: RoleId): Promise<Role | null>;
  findByName(name: RoleName): Promise<Role | null>;
  update(role: Role): Promise<void>;
  delete(id: RoleId): Promise<void>;
  list(): Promise<Role[]>;
}
