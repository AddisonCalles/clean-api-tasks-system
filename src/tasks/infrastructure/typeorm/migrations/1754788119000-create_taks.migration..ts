import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1754788119000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla principal de tareas
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tasks.tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        estimated_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
        time_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
        due_date TIMESTAMP NOT NULL,
        completion_date TIMESTAMP NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        cost DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_by UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )
    `);

    // Crear tabla de relación entre tareas y usuarios asignados
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tasks.task_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        task_id UUID NOT NULL,
        user_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(task_id, user_id)
      )
    `);

    // Crear índices para la tabla tasks
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_title ON tasks.tasks (title);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_status ON tasks.tasks (status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_due_date ON tasks.tasks (due_date);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_completion_date ON tasks.tasks (completion_date);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_created_by ON tasks.tasks (created_by);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_created_at ON tasks.tasks (created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_updated_at ON tasks.tasks (updated_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_deleted_at ON tasks.tasks (deleted_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_cost ON tasks.tasks (cost);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_estimated_hours ON tasks.tasks (estimated_hours);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_time_spent ON tasks.tasks (time_spent);
    `);

    // Crear índices para la tabla task_users
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_users_task_id ON tasks.task_users (task_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_users_user_id ON tasks.task_users (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_users_created_at ON tasks.task_users (created_at);
    `);

    // Crear clave foránea para tasks.created_by
    await queryRunner.query(`
      ALTER TABLE tasks.tasks 
      ADD CONSTRAINT fk_tasks_created_by 
      FOREIGN KEY (created_by) 
      REFERENCES users.users(id) 
      ON DELETE RESTRICT
    `);

    // Crear claves foráneas para task_users
    await queryRunner.query(`
      ALTER TABLE tasks.task_users 
      ADD CONSTRAINT fk_task_users_task_id 
      FOREIGN KEY (task_id) 
      REFERENCES tasks.tasks(id) 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE tasks.task_users 
      ADD CONSTRAINT fk_task_users_user_id 
      FOREIGN KEY (user_id) 
      REFERENCES users.users(id) 
      ON DELETE CASCADE
    `);

    // Crear índices compuestos para optimizar consultas comunes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_status_due_date ON tasks.tasks (status, due_date);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_created_by_status ON tasks.tasks (created_by, status);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_status_completion_date ON tasks.tasks (status, completion_date);
    `);

    // Crear índices para consultas de estadísticas
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_status_cost ON tasks.tasks (status, cost);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_status_time_spent ON tasks.tasks (status, time_spent);
    `);

    // Crear índices para consultas de usuarios asignados
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_users_user_task ON tasks.task_users (user_id, task_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar claves foráneas
    await queryRunner.query(`
      ALTER TABLE tasks.task_users DROP CONSTRAINT IF EXISTS fk_task_users_user_id;
    `);

    await queryRunner.query(`
      ALTER TABLE tasks.task_users DROP CONSTRAINT IF EXISTS fk_task_users_task_id;
    `);

    await queryRunner.query(`
      ALTER TABLE tasks.tasks DROP CONSTRAINT IF EXISTS fk_tasks_created_by;
    `);

    // Eliminar índices compuestos
    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_users_user_task;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_status_time_spent;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_status_cost;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_status_completion_date;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_created_by_status;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_status_due_date;
    `);

    // Eliminar índices de task_users
    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_users_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_users_user_id;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_users_task_id;
    `);

    // Eliminar índices de tasks
    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_time_spent;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_estimated_hours;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_cost;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_deleted_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_updated_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_created_at;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_created_by;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_completion_date;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_due_date;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_status;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_title;
    `);

    // Eliminar tablas
    await queryRunner.query(`
      DROP TABLE IF EXISTS tasks.task_users;
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS tasks.tasks;
    `);
  }
}
