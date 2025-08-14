import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1754788118467 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        role_id UUID NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users.permissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(300) NOT NULL UNIQUE,
        description TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )
    `);

    // Insertar permisos predefinidos
    await queryRunner.query(`
          INSERT INTO users.permissions (id, name, description, created_at, updated_at) VALUES
            (uuid_generate_v4(), 'create_task', 'Allows creating new tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'edit_task', 'Allows editing existing tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'delete_task', 'Allows deleting tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'assign_users_task', 'Allows assigning users to tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_all_tasks', 'Allows viewing all system tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'manage_users', 'Allows managing system users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'access_analytics', 'Allows accessing system analytics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'create_user', 'Allows creating new users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'edit_user', 'Allows editing existing users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'delete_user', 'Allows deleting users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_user', 'Allows viewing users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_task', 'Allows viewing users tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_all_users', 'Allows viewing all users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_roles', 'Allows viewing roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'view_task_statistics', 'Allows viewing task statistics', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'manage_roles', 'Allows managing roles', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'manage_permissions', 'Allows managing permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (uuid_generate_v4(), 'manage_role_permissions', 'Allows managing role permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `);

    // Crear índices basados en la entidad Permission y las consultas del repositorio
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permission_name ON users.permissions (name);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permission_created_at ON users.permissions (created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permission_updated_at ON users.permissions (updated_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permission_deleted_at ON users.permissions (deleted_at);
    `);

    // Crear índices basados en la entidad User
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_email ON users.users (email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_role_id ON users.users (role_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_created_at ON users.users (created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_updated_at ON users.users (updated_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_deleted_at ON users.users (deleted_at);
    `);

    // Crear tabla roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users.roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(300) NOT NULL UNIQUE,
        description TEXT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )
    `);

    // Crear tabla role_permissions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users.role_permissions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        role_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices para la tabla roles
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_roles_name ON users.roles (name);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_roles_created_at ON users.roles (created_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_roles_updated_at ON users.roles (updated_at);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_roles_deleted_at ON users.roles (deleted_at);
    `);

    // Crear índices para la tabla role_permissions
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permission_role_id ON users.role_permissions (role_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permission_permission_id ON users.role_permissions (permission_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permission_created_at ON users.role_permissions (created_at);
    `);

    // Crear claves foráneas para role_permissions
    await queryRunner.query(`
      ALTER TABLE users.role_permissions 
      ADD CONSTRAINT fk_role_permissions_role_id 
      FOREIGN KEY (role_id) 
      REFERENCES users.roles(id) 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE users.role_permissions 
      ADD CONSTRAINT fk_role_permissions_permission_id 
      FOREIGN KEY (permission_id) 
      REFERENCES users.permissions(id) 
      ON DELETE CASCADE
    `);

    // Crear clave foránea para users.role_id
    await queryRunner.query(`
      ALTER TABLE users.users 
      ADD CONSTRAINT fk_users_role_id 
      FOREIGN KEY (role_id) 
      REFERENCES users.roles(id) 
      ON DELETE RESTRICT
    `);

    // Insertar roles predefinidos
    const adminRoleId = 'uuid_generate_v4()';
    const memberRoleId = 'uuid_generate_v4()';

    await queryRunner.query(`
      INSERT INTO users.roles (id, name, description, created_at, updated_at) VALUES
        (${adminRoleId}, 'administrator', 'Role with full system access', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (${memberRoleId}, 'member', 'Role with limited system access', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (name) DO NOTHING;
    `);

    // Asignar permisos al rol administrador (todos los permisos)
    await queryRunner.query(`
      INSERT INTO users.role_permissions (id, role_id, permission_id, created_at)
      SELECT 
        uuid_generate_v4(),
        r.id,
        p.id,
        CURRENT_TIMESTAMP
      FROM users.roles r
      CROSS JOIN users.permissions p
      WHERE r.name = 'administrator'
      ON CONFLICT DO NOTHING;
    `);

    // Asignar permisos al rol miembro (permisos limitados)
    await queryRunner.query(`
      INSERT INTO users.role_permissions (id, role_id, permission_id, created_at)
      SELECT 
        uuid_generate_v4(),
        r.id,
        p.id,
        CURRENT_TIMESTAMP
      FROM users.roles r
      CROSS JOIN users.permissions p
      WHERE r.name = 'member' 
        AND p.name IN ('create_task', 'edit_task', 'view_all_tasks', 'view_user', 'view_all_users', 'edit_user', 'delete_user')
      ON CONFLICT DO NOTHING;
    `);

    // Insertar usuario administrador por defecto
    await queryRunner.query(`
      INSERT INTO users.users (id, name, email, password_hash, role_id, created_at, updated_at)
      SELECT 
        uuid_generate_v4(),
        'Administrator',
        'admin@taskapi.com',
        '$2a$10$Vg903qCWiLuhZxXEh3rPyu1CeUhLpmVLjp0wXdizkWJZOHO/9wlGK',
        r.id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      FROM users.roles r
      WHERE r.name = 'administrator'
      ON CONFLICT (email) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar claves foráneas
    await queryRunner.query(`
      ALTER TABLE users.users DROP CONSTRAINT IF EXISTS fk_users_role_id;
    `);

    await queryRunner.query(`
      ALTER TABLE users.role_permissions DROP CONSTRAINT IF EXISTS fk_role_permissions_permission_id;
    `);

    await queryRunner.query(`
      ALTER TABLE users.role_permissions DROP CONSTRAINT IF EXISTS fk_role_permissions_role_id;
    `);

    // Eliminar índices de role_permissions
    await queryRunner.query(`
      DROP INDEX IF EXISTS users.idx_role_permission_created_at;
      DROP INDEX IF EXISTS users.idx_role_permission_permission_id;
      DROP INDEX IF EXISTS users.idx_role_permission_role_id;
    `);

    // Eliminar índices de roles
    await queryRunner.query(`
      DROP INDEX IF EXISTS users.idx_roles_deleted_at;
      DROP INDEX IF EXISTS users.idx_roles_updated_at;
      DROP INDEX IF EXISTS users.idx_roles_created_at;
      DROP INDEX IF EXISTS users.idx_roles_name;
    `);

    // Eliminar índices de permissions
    await queryRunner.query(`
      DROP INDEX IF EXISTS users.idx_permission_name;
      DROP INDEX IF EXISTS users.idx_permission_created_at;
      DROP INDEX IF EXISTS users.idx_permission_updated_at;
      DROP INDEX IF EXISTS users.idx_permission_deleted_at;
    `);

    // Eliminar índices de users
    await queryRunner.query(`
      DROP INDEX IF EXISTS users.idx_user_email;
      DROP INDEX IF EXISTS users.idx_user_role_id;
      DROP INDEX IF EXISTS users.idx_user_created_at;
      DROP INDEX IF EXISTS users.idx_user_updated_at;
      DROP INDEX IF EXISTS users.idx_user_deleted_at;
    `);

    // Eliminar tablas
    await queryRunner.query(`
      DROP TABLE IF EXISTS users.role_permissions;
      DROP TABLE IF EXISTS users.roles;
      DROP TABLE IF EXISTS users.permissions;
      DROP TABLE IF EXISTS users.users;
    `);
  }
}
