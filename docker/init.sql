-- Script de inicialización de la base de datos
-- Crear el esquema tasks si no existe
CREATE SCHEMA IF NOT EXISTS tasks;
CREATE SCHEMA IF NOT EXISTS users;

-- Crear extensiones útiles para desarrollo
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar permisos para el esquema tasks
GRANT ALL PRIVILEGES ON SCHEMA tasks TO postgres;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA tasks TO postgres;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA tasks TO postgres;

-- Configurar búsqueda de esquemas
ALTER DATABASE tasks_db SET search_path TO tasks, public;

-- Crear índices útiles para desarrollo (se crearán automáticamente con TypeORM)
-- Los índices específicos se crearán cuando se ejecute la aplicación

-- Configurar logging para desarrollo
ALTER SYSTEM SET log_statement = 'all';

ALTER SYSTEM SET log_min_duration_statement = 0;

ALTER SYSTEM
SET
    log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';

-- Recargar configuración
SELECT pg_reload_conf ();