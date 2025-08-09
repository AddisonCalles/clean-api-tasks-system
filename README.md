<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Task API System.</p>
    <p align="center">


## Description
### Estructura



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

## Project setup

### Prerrequisitos

- Node.js (versión 18 o superior)
- Docker y Docker Compose
- npm o yarn

### Instalación

```bash
$ npm install
```

### Configuración de la base de datos

> ⚠️ **ADVERTENCIA**: Esta configuración está diseñada únicamente para desarrollo local. 
> 
> **NO USE** estas configuraciones en un ambiente de producción ya que:
> - Las credenciales son débiles y están hardcodeadas
> - No incluye configuraciones de seguridad adecuadas
> - No considera escalabilidad ni alta disponibilidad
> - pgAdmin está expuesto sin autenticación robusta
> - No hay cifrado de datos ni backups automáticos
> 
> Para producción, considere usar servicios gestionados como AWS RDS, Google Cloud SQL, o Azure Database for PostgreSQL con configuraciones de seguridad apropiadas.

1. Copia el archivo de variables de entorno:
```bash
$ cp env.example .env
```

2. Inicia la base de datos PostgreSQL con Docker:
```bash
# Opción 1: Usar el script de PowerShell (Windows)
$ .\docker\start-db.ps1

# Opción 2: Usar docker-compose directamente
$ docker-compose up -d
```

3. Verifica que la base de datos esté funcionando:
```bash
$ docker-compose ps
```

**Información de conexión (SOLO DESARROLLO LOCAL):**
- Host: localhost
- Puerto: 5432
- Base de datos: tasks_db
- Usuario: postgres
- Contraseña: postgres

**pgAdmin (opcional - SOLO DESARROLLO LOCAL):**
- URL: http://localhost:8080
- Email: admin@tasks.com
- Password: admin

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

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

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
