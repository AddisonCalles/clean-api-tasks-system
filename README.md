<p align="center">
  <img src="./resources/ddd-clean-architecture.png" width="200" alt="DDD Task API System" />
</p>
<h1 align="center">Task API System.</h1>
<h2 align="center">DDD Clean Architecture</h2>

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)


## Documentación OpenAPI
- **Especificación OpenAPI**: [openapi.yaml](./openapi.yaml)

## Información de permisos:
- **Documentación**: [README de Auth](./src/auth/README.md)
## Description

Este proyecto está construido utilizando el framework NestJS, siguiendo una arquitectura modular y escalable. La aplicación se organiza en módulos independientes para cada dominio principal, como tareas y usuarios, lo que facilita el mantenimiento y la extensión del sistema.

La capa de infraestructura utiliza TypeORM para la gestión de la base de datos PostgreSQL, aprovechando migraciones para la creación y actualización de esquemas. El acceso a la base de datos está desacoplado mediante repositorios, permitiendo una fácil adaptación a otros motores en el futuro.

El sistema de autenticación y autorización se basa en JWT, con generación y validación de claves asimétricas. Los permisos y roles de usuario están gestionados a nivel de base de datos, permitiendo un control granular de acceso a las funcionalidades.

El despliegue y la gestión de la base de datos se realiza mediante Docker, asegurando entornos reproducibles y consistentes para desarrollo y producción.

En resumen, la arquitectura sigue principios de separación de responsabilidades, inyección de dependencias y buenas prácticas de desarrollo backend moderno.

## Pre-requisitos:

- node 20.0.0 o superior
- Docker y Docker Compose para ejecutar base de datos en local.

## Inicio rápido ambiente local

1. Clone el repositorio
2. Instalar paquetes de NPM.

- `npm run i`

3. Configure el archivo de variables de entorno `.env`

```bash
DATA_SOURCE=DATA_SOURCE
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=tasks_db
```

3. Inicie el demonio de Docker.
4. Compile la imágen de docker.

- `npm run db:build`

5. Genere el nuevo par de claves public.key y private.key

- `npm run keys:generate`

6. Ejecute el entorno local.

- `npm run start:dev`

7. Utilice la colección de postman `api-doc.collection.json`

- Usuario y contraseña de administrador default:
  - correo: admin@taskapi.com
  - contraseña: password (Cambiar esta contraseña por defecto para ambientes productivos)

### Estructura

### Reglas de Migración

Para crear nuevas migraciones en el proyecto, sigue las reglas establecidas en [MIGRATION_RULES.md](./MIGRATION_RULES.md). Este documento incluye:

- Principios fundamentales de migraciones
- Estructura y nomenclatura de archivos
- Reglas para tablas, relaciones e índices
- Ejemplos completos y mejores prácticas
- Comandos útiles para gestión de migraciones

#### Herramientas de Validación

El proyecto incluye herramientas automatizadas para validar que las migraciones sigan las reglas establecidas:

```bash
# Validar todas las migraciones del proyecto
npm run migration:validate

# Validar migraciones de un módulo específico
npm run migration:validate src/tasks/infrastructure/typeorm/migrations
```

La validación verifica:
- Nomenclatura de archivos y clases
- Estructura de métodos up() y down()
- Uso de mejores prácticas SQL
- Nomenclatura de tablas e índices
- Integridad referencial

### Funcionalidades

Este proyecto consta de las siguientes funcionalidades.

- Modulo de tareas
  - Creación de tareas
  - Editar tareas
  - Completar tareas
  - Obtener reporte estadísticos
    - Por usuario o general
  - Listar tareas
    - por usuario
    - por fecha de expiración
    - por status
- Usuarios
  - Registro de usuarios
  - Login
  - Eliminación de usuarios

> ⚠️ **ADVERTENCIA**: Esta configuración está diseñada únicamente para desarrollo local.
>
> **NO USE** estas configuraciones en un ambiente de producción ya que:
>
> - Las credenciales son débiles y están hardcodeadas
> - No incluye configuraciones de seguridad adecuadas
> - No considera escalabilidad ni alta disponibilidad
> - pgAdmin está expuesto sin autenticación robusta
> - No hay cifrado de datos ni backups automáticos
>
> Para producción, considere usar servicios gestionados como AWS RDS, Google Cloud SQL, o Azure Database for PostgreSQL con configuraciones de seguridad apropiadas.

**Información de conexión (SOLO DESARROLLO LOCAL):**

- Host: localhost
- Puerto: 5432
- Base de datos: tasks_db
- Usuario: postgres
- Contraseña: postgres

## Ejecutar Tests



```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Consideraciones para Producción

### Base de Datos

- **NO USE** la configuración Docker local en producción
- Implemente una base de datos gestionada (AWS RDS, Google Cloud SQL, Azure Database)
- Configure credenciales seguras y rotación de contraseñas
- Habilite cifrado en tránsito y en reposo
- Configure backups automáticos y point-in-time recovery
- Implemente monitoreo y alertas

### Seguridad

- Use variables de entorno seguras para credenciales
- Implemente autenticación robusta (JWT, OAuth, etc.)
- Configure CORS apropiadamente
- Use HTTPS en producción
- Implemente rate limiting y protección contra ataques
- Configure firewalls y grupos de seguridad

### Escalabilidad

- Use balanceadores de carga
- Implemente caching (Redis, Memcached)
- Configure auto-scaling
- Use CDN para assets estáticos
- Implemente microservicios si es necesario

### Monitoreo y Logging

- Configure logging centralizado
- Implemente APM (Application Performance Monitoring)
- Configure alertas para métricas críticas
- Use herramientas como Prometheus, Grafana, ELK Stack
