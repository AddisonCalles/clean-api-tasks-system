# Configuración de Base de Datos con Docker

Este directorio contiene la configuración de Docker para ejecutar PostgreSQL localmente.

## Archivos

- `Dockerfile`: Configuración de la imagen de PostgreSQL
- `init.sql`: Script de inicialización de la base de datos
- `docker-compose.yml`: Orquestación de servicios (PostgreSQL + pgAdmin)

## Variables de Entorno

Copia el archivo `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

### Variables principales:

- `DB_HOST`: Host de la base de datos (localhost)
- `DB_PORT`: Puerto de PostgreSQL (5432)
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos

## Comandos útiles

### Iniciar servicios
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f postgres
```

### Detener servicios
```bash
docker-compose down
```

### Reconstruir imagen
```bash
docker-compose build --no-cache
```

### Acceder a PostgreSQL
```bash
docker exec -it tasks-postgres psql -U postgres -d tasks_db
```

### Acceder a pgAdmin
- URL: http://localhost:8080
- Email: admin@tasks.com
- Password: admin

## Configuración de la aplicación

Asegúrate de que tu aplicación use las mismas variables de entorno:

```typescript
// En database.providers.ts
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ...
};
```

## Esquema de base de datos

La base de datos se inicializa con:
- Esquema `tasks` para las tablas de la aplicación
- Extensiones `uuid-ossp` y `pgcrypto`
- Configuración de logging para desarrollo
- Permisos apropiados para el usuario postgres

## Puertos

- **PostgreSQL**: 5432 (puerto estándar)
- **pgAdmin**: 8080 (opcional, para administración visual)
