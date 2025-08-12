# Reglas para Crear Migraciones

## 📋 Descripción General

Este documento establece las reglas y mejores prácticas para crear nuevas migraciones en el proyecto Task API System. Las migraciones son fundamentales para mantener la integridad y evolución de la base de datos de manera controlada y reproducible.

## 🎯 Principios Fundamentales

### 1. **Inmutabilidad de Migraciones**
- **NUNCA** modificar migraciones ya ejecutadas en producción
- **NUNCA** cambiar el contenido de una migración después de ser commitada
- Si necesitas cambios, crea una nueva migración

### 2. **Versionado Semántico**
- Usar timestamps como prefijo para ordenar migraciones
- Formato: `YYYYMMDDHHMMSS-description.migration.ts`
- Ejemplo: `1754788119000-create_tasks.migration.ts`

### 3. **Reversibilidad**
- Toda migración debe tener un método `down()` que revierta los cambios
- El método `down()` debe ser el inverso exacto del método `up()`

## 📁 Estructura de Archivos

### Ubicación de Migraciones
```
src/
├── [module]/
│   └── infrastructure/
│       └── typeorm/
│           └── migrations/
│               ├── index.ts
│               ├── YYYYMMDDHHMMSS-description.migration.ts
│               └── YYYYMMDDHHMMSS-another_description.migration.ts
```

### Archivo de Índice
Cada carpeta de migraciones debe tener un `index.ts` que exporte todas las migraciones:

```typescript
import { MigrationName } from './YYYYMMDDHHMMSS-description.migration.';

export const moduleMigrations = [MigrationName];
```

## 🏗️ Estructura de una Migración

### Template Básico
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationNameYYYYMMDDHHMMSS implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Implementación de la migración
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reversión de la migración
  }
}
```

## 📊 Reglas para Tablas

### 1. **Nomenclatura**
- Usar snake_case para nombres de tablas y columnas
- Prefijo con el esquema del módulo: `[module].[table_name]`
- Ejemplo: `tasks.tasks`, `users.users`

### 2. **Campos Obligatorios**
Toda tabla debe incluir:
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
```

### 3. **Tipos de Datos**
- **UUIDs**: Para IDs y relaciones
- **VARCHAR(n)**: Para textos con límite conocido
- **TEXT**: Para textos largos sin límite
- **DECIMAL(p,s)**: Para valores monetarios y horas
- **TIMESTAMP**: Para fechas y horas
- **BOOLEAN**: Para valores true/false

### 4. **Constraints**
- **NOT NULL**: Para campos obligatorios
- **UNIQUE**: Para valores únicos
- **DEFAULT**: Para valores por defecto
- **CHECK**: Para validaciones de dominio

## 🔗 Reglas para Relaciones

### 1. **Claves Foráneas**
- Usar `ON DELETE RESTRICT` para relaciones críticas
- Usar `ON DELETE CASCADE` para relaciones dependientes
- Usar `ON DELETE SET NULL` para relaciones opcionales

### 2. **Tablas de Relación**
Para relaciones muchos a muchos:
```sql
CREATE TABLE IF NOT EXISTS [module].[relation_table] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  [entity1]_id UUID NOT NULL,
  [entity2]_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE([entity1]_id, [entity2]_id)
);
```

## 🔍 Reglas para Índices

### 1. **Índices Simples**
Crear índices para:
- Campos de búsqueda frecuente
- Campos de ordenamiento
- Campos de filtrado
- Claves foráneas

### 2. **Índices Compuestos**
Crear índices compuestos para consultas frecuentes:
```sql
CREATE INDEX IF NOT EXISTS idx_table_field1_field2 ON [module].[table] (field1, field2);
```

### 3. **Índices de Auditoría**
Siempre incluir:
```sql
CREATE INDEX IF NOT EXISTS idx_table_created_at ON [module].[table] (created_at);
CREATE INDEX IF NOT EXISTS idx_table_updated_at ON [module].[table] (updated_at);
CREATE INDEX IF NOT EXISTS idx_table_deleted_at ON [module].[table] (deleted_at);
```

## 🛡️ Reglas de Seguridad

### 1. **Validación de Datos**
- Usar constraints CHECK para validaciones de dominio
- Implementar validaciones a nivel de aplicación
- Usar tipos de datos apropiados

### 2. **Integridad Referencial**
- Siempre definir claves foráneas
- Usar constraints apropiados
- Validar datos antes de insertar

## 📝 Ejemplo Completo

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1754788119000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla principal
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tasks.tasks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        created_by UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )
    `);

    // Crear índices
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_task_title ON tasks.tasks (title);
      CREATE INDEX IF NOT EXISTS idx_task_status ON tasks.tasks (status);
      CREATE INDEX IF NOT EXISTS idx_task_created_by ON tasks.tasks (created_by);
      CREATE INDEX IF NOT EXISTS idx_task_created_at ON tasks.tasks (created_at);
      CREATE INDEX IF NOT EXISTS idx_task_updated_at ON tasks.tasks (updated_at);
      CREATE INDEX IF NOT EXISTS idx_task_deleted_at ON tasks.tasks (deleted_at);
    `);

    // Crear clave foránea
    await queryRunner.query(`
      ALTER TABLE tasks.tasks 
      ADD CONSTRAINT fk_tasks_created_by 
      FOREIGN KEY (created_by) 
      REFERENCES users.users(id) 
      ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar clave foránea
    await queryRunner.query(`
      ALTER TABLE tasks.tasks DROP CONSTRAINT IF EXISTS fk_tasks_created_by;
    `);

    // Eliminar índices
    await queryRunner.query(`
      DROP INDEX IF EXISTS tasks.idx_task_deleted_at;
      DROP INDEX IF EXISTS tasks.idx_task_updated_at;
      DROP INDEX IF EXISTS tasks.idx_task_created_at;
      DROP INDEX IF EXISTS tasks.idx_task_created_by;
      DROP INDEX IF EXISTS tasks.idx_task_status;
      DROP INDEX IF EXISTS tasks.idx_task_title;
    `);

    // Eliminar tabla
    await queryRunner.query(`
      DROP TABLE IF EXISTS tasks.tasks;
    `);
  }
}
```

## 🚀 Comandos Útiles

### Generar Nueva Migración
```bash
# Usando TypeORM CLI
npx typeorm migration:generate -n MigrationName

# Manualmente
# Crear archivo: YYYYMMDDHHMMSS-description.migration.ts
```

### Ejecutar Migraciones
```bash
# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Mostrar estado de migraciones
npm run migration:show
```

### Status Migraciones

```bash
migration:status
```

## ⚠️ Advertencias Importantes

### 1. **Backup Antes de Migraciones**
- Siempre hacer backup antes de ejecutar migraciones en producción
- Probar migraciones en ambiente de desarrollo primero

### 2. **Migraciones de Datos**
- Para migraciones que modifican datos existentes, usar transacciones
- Implementar rollback de datos en el método `down()`

### 3. **Migraciones de Esquema**
- Para cambios de esquema complejos, considerar migraciones múltiples
- Documentar el impacto en el rendimiento

### 4. **Compatibilidad**
- Asegurar compatibilidad con versiones anteriores
- Considerar migraciones de datos para cambios breaking

## 📚 Referencias

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/index.html)
- [Database Migration Patterns](https://martinfowler.com/articles/evodb.html)

## 🤝 Contribución

Para contribuir a las reglas de migración:

1. Revisar las reglas existentes
2. Proponer mejoras mediante issues
3. Documentar casos especiales
4. Mantener consistencia en el proyecto

---

**Última actualización**: Agosto 2025
**Versión**: 1.0.0
