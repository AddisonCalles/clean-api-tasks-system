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
  estimatedHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  timeSpent: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  dueDate: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completionDate: Date | null;

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
  createdBy: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;
}
