import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import type { EntityID } from '@shared/domain/value-objects';

@Entity({
  name: 'role_permissions',
  schema: 'users',
})
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: EntityID;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  role_id: EntityID;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  permission_id: EntityID;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
