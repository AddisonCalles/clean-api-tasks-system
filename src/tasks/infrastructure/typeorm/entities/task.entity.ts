import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { TaskStatusEnum } from '@tasks/domain/value-objects/task-status.value-object';

@Entity({
  schema: 'tasks',
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  estimated_hours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  time_spent: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  due_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completion_date: Date | null;

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    nullable: false,
    default: TaskStatusEnum.ACTIVE,
  })
  status: TaskStatusEnum;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: false,
    default: 0,
  })
  cost: number;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  created_by: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at: Date | null;
}
