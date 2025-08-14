import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_users', schema: 'tasks' })
export class TaskUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'task_id',
    type: 'uuid',
    nullable: false,
  })
  taskId: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}
