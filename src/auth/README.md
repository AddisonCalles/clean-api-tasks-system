# Arquitectura de Autorización Basada en Permisos

## Descripción General

Esta arquitectura implementa un sistema de autorización basado únicamente en permisos siguiendo los principios de Clean Architecture. Permite validar el acceso a endpoints basándose en los permisos del usuario autenticado, utilizando los repositorios existentes de usuarios y permisos.

## Estructura de la Arquitectura

### Capa de Dominio (Domain)

#### Value Objects
- **`AuthorizationContext`**: Encapsula el contexto de autorización (usuario y permisos requeridos)
  - Valida que el usuario tenga todos los permisos requeridos
  - Proporciona métodos para obtener permisos faltantes

#### Excepciones
- **`AuthorizationException`**: Excepción base para errores de autorización
- **`InsufficientPermissionsException`**: Cuando el usuario no tiene permisos suficientes

### Capa de Aplicación (Application)

#### Casos de Uso
- **`AuthenticateUserUseCase`**: Autentica un usuario y crea una sesión JWT
- **`AuthorizeUserUseCase`**: Valida si un usuario tiene los permisos requeridos

#### DTOs
- **`AuthenticateUserRequest/Response`**: Para autenticación de usuarios
- **`AuthorizeUserRequest/Response`**: Para autorización de usuarios

#### Puertos
- **`SessionManagerPort`**: Interfaz para gestión de sesiones JWT
- **`PasswordHashPort`**: Interfaz para hashing de contraseñas

### Capa de Infraestructura (Infrastructure)

#### Servicios
- **`AuthAPIService`**: Implementa la lógica de autenticación y autorización
- **`SessionJWTManagerAdapter`**: Implementa la gestión de sesiones JWT

#### Guards
- **`PermissionGuard`**: Guard de NestJS que valida permisos en endpoints
  - Extrae el token JWT del header Authorization
  - Valida la sesión usando SessionManager
  - Ejecuta AuthorizeUserUseCase para validar permisos
  - Agrega la sesión del usuario al request

#### Decoradores
- **`RequirePermissions`**: Decorador principal para especificar permisos requeridos
- **Decoradores específicos**: `RequiredCreateTaskPermissions`, `RequiredViewAllTasksPermissions`, etc.

## Permisos Disponibles

Basándose en el enum `PermissionNameEnum`, los siguientes permisos están disponibles:

### Permisos de Tareas
- `create_task`: Crear nuevas tareas
- `edit_task`: Editar tareas existentes
- `delete_task`: Eliminar tareas
- `assign_users_task`: Asignar usuarios a tareas
- `view_all_tasks`: Ver todas las tareas del sistema
- `view_task`: Ver detalles de una tarea específica

### Permisos de Usuarios
- `create_user`: Crear nuevos usuarios
- `edit_user`: Editar usuarios existentes
- `delete_user`: Eliminar usuarios
- `view_user`: Ver detalles de usuarios
- `view_all_users`: Ver todos los usuarios
- `manage_users`: Gestión completa de usuarios

### Permisos de Roles y Permisos
- `create_role`: Crear nuevos roles
- `view_roles`: Ver lista de roles
- `manage_roles`: Gestionar roles
- `manage_permissions`: Gestionar permisos
- `manage_role_permissions`: Gestionar asignaciones de permisos a roles

### Permisos de Analytics
- `access_analytics`: Acceder a analytics del sistema
- `view_task_statistics`: Ver estadísticas de tareas

## Uso de la Arquitectura

### 1. Proteger un Endpoint

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '@auth/infrastructure/guards/permission.guard';
import { RequiredViewAllTasksPermissions } from '@tasks/infrastructure/decorators/task.decorator';

@Controller('tasks')
@UseGuards(PermissionGuard)
export class TaskController {
  
  @Get()
  @RequiredViewAllTasksPermissions()
  async getAllTasks() {
    // Solo usuarios con permiso 'view_all_tasks' pueden acceder
    return { tasks: [] };
  }
}
```

### 2. Requerir Múltiples Permisos

```typescript
import { RequirePermissions } from '@auth/infrastructure/decorators/permissions.decorator';
import { PermissionNameEnum } from '@users/domain/value-objects/permission-name.value-object';

@Post(':id/complete')
@RequirePermissions(
  PermissionNameEnum.EDIT_TASK,
  PermissionNameEnum.VIEW_ALL_TASKS
)
async completeTask(@Param('id') id: string) {
  // Requiere ambos permisos
  return { message: 'Task completed' };
}
```

### 3. Usar Decoradores Específicos

```typescript
@Post()
@RequiredCreateTaskPermissions()
async createTask(@Body() createTaskDto: any) {
  // Solo usuarios con permiso 'create_task'
  return { message: 'Task created' };
}

@Put(':id')
@RequiredUpdateTaskPermissions()
async updateTask(@Param('id') id: string, @Body() updateTaskDto: any) {
  // Solo usuarios con permiso 'edit_task'
  return { message: 'Task updated' };
}
```

### 4. Acceder a Información del Usuario

```typescript
@Get('profile')
@RequiredViewUserPermissions()
async getProfile(@Req() request: any) {
  // El guard agrega la sesión del usuario al request
  const userSession = request.userSession;
  return {
    id: userSession.getUserId(),
    email: userSession.getEmail(),
    role: userSession.getRole(),
    permissions: userSession.getPermissions()
  };
}
```

## Flujo de Autorización

1. **Request llega al endpoint**
2. **PermissionGuard intercepta la request**
3. **Extrae el token JWT del header Authorization**
4. **Valida la sesión usando SessionManager**
5. **Ejecuta AuthorizeUserUseCase para validar permisos**
6. **AuthorizeUserUseCase obtiene los permisos del usuario desde la base de datos**
7. **Crea AuthorizationContext para validar permisos**
8. **Si tiene permisos suficientes, permite el acceso y agrega la sesión al request**
9. **Si no tiene permisos, lanza InsufficientPermissionsException**

## Integración con Repositorios Existentes

La arquitectura utiliza los repositorios existentes:

- **`UserRepository`**: Para obtener información del usuario
- **`RolePermissionRepository`**: Para obtener los permisos del usuario basándose en su rol
- **`RoleRepository`**: Para obtener información del rol del usuario

### Ejemplo de Consulta de Permisos

```typescript
// En AuthorizeUserUseCase
public async execute(request: AuthorizeUserRequest): Promise<AuthorizeUserResponse> {
  const user = await this.userRepository.findById(request.userId);
  if (!user) {
    throw new UserNotFoundException(request.userId.value);
  }

  const userPermissions = await this.userPermissionRepository.findByRoleId(
    user.roleId,
  );

  const context = new AuthorizationContext({
    userId: request.userId,
    userPermissions: userPermissions.map((p) => p.name),
    requiredPermissions: request.requiredPermissions,
  });

  const isAuthorized = context.hasRequiredPermissions();
  
  if (!isAuthorized) {
    throw new InsufficientPermissionsException(
      request.requiredPermissions.map((p) => p.value),
      userPermissions.map((p) => p.name.value),
    );
  }

  return {
    isAuthorized: true,
    userId: request.userId,
    requiredPermissions: request.requiredPermissions,
    userPermissions: userPermissions.map((p) => p.name),
    missingPermissions: context.getMissingPermissions(),
  };
}
```

## Configuración

### 1. Importar el AuthModule

```typescript
import { AuthModule } from '@auth/infrastructure/auth.module';

@Module({
  imports: [AuthModule],
  // ...
})
export class AppModule {}
```

### 2. Usar el Guard Globalmente (Opcional)

```typescript
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from '@auth/infrastructure/guards/permission.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
```

## Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**: Autenticación y autorización claramente separadas
2. **Clean Architecture**: Sigue los principios de Clean Architecture con capas bien definidas
3. **Reutilización**: Los casos de uso pueden ser reutilizados en diferentes contextos
4. **Testabilidad**: Fácil de testear gracias a la inyección de dependencias
5. **Flexibilidad**: Fácil agregar nuevos permisos y decoradores
6. **Seguridad**: Validación robusta de tokens JWT y permisos
7. **Mantenibilidad**: Código organizado y fácil de entender
8. **Escalabilidad**: Se puede extender fácilmente para nuevos tipos de recursos

## APIs Disponibles

El sistema expone las siguientes APIs organizadas por módulos:

### Autenticación (`/auth`)
- **POST** `/auth/login` - Iniciar sesión de usuario
  - **Permisos**: Ninguno (público)
  - **Descripción**: Autentica un usuario y devuelve un token JWT

### Tareas (`/tasks`)
- **GET** `/tasks` - Obtener lista de tareas
  - **Permisos**: `view_all_tasks`
  - **Filtros**: status, assignedUserId, dueDateFrom, dueDateTo, page, limit

- **POST** `/tasks` - Crear nueva tarea
  - **Permisos**: `create_task`
  - **Campos requeridos**: title, description, estimatedHours, dueDate, cost

- **GET** `/tasks/{id}` - Obtener tarea por ID
  - **Permisos**: `view_task`
  - **Parámetros**: id (UUID)

- **PUT** `/tasks/{id}` - Actualizar tarea
  - **Permisos**: `edit_task`
  - **Campos opcionales**: title, description, estimatedHours, timeSpent, dueDate, status, cost, assignedUserIds

- **PATCH** `/tasks/{id}/users` - Asignar usuarios a tarea
  - **Permisos**: `assign_users_task`
  - **Campos requeridos**: assignedUserIds (array de UUIDs)

- **PATCH** `/tasks/{id}/complete` - Completar tarea
  - **Permisos**: `edit_task`
  - **Descripción**: Marca una tarea como completada

### Estadísticas (`/statistics`)
- **GET** `/statistics/tasks` - Estadísticas generales de tareas
  - **Permisos**: `view_task_statistics`
  - **Retorna**: totalTasks, completedTasks, pendingTasks, inProgressTasks, totalCost, averageCompletionTime

- **GET** `/statistics/tasks/user/{userId}` - Estadísticas por usuario
  - **Permisos**: `view_task_statistics`
  - **Retorna**: totalAssignedTasks, completedTasks, pendingTasks, totalCost, averageCompletionTime

### Usuarios (`/users`)
- **GET** `/users` - Obtener lista de usuarios
  - **Permisos**: `view_all_users`
  - **Filtros**: name, email, roleId, page, limit

- **POST** `/users` - Crear nuevo usuario
  - **Permisos**: `create_user`
  - **Campos requeridos**: name, email, password

- **GET** `/users/{id}` - Obtener usuario por ID
  - **Permisos**: `view_user`
  - **Parámetros**: id (UUID)

- **PATCH** `/users/{id}` - Actualizar usuario
  - **Permisos**: `edit_user`
  - **Campos opcionales**: name, email, password

- **DELETE** `/users/{id}` - Eliminar usuario
  - **Permisos**: `delete_user`
  - **Parámetros**: id (UUID)

### Roles (`/roles`)
- **GET** `/roles` - Obtener lista de roles
  - **Permisos**: `view_roles`
  - **Retorna**: Lista de roles con sus permisos

- **POST** `/roles` - Crear nuevo rol
  - **Permisos**: `create_role`
  - **Campos requeridos**: name, description

- **PUT** `/roles/permissions` - Asignar permisos a rol
  - **Permisos**: `manage_role_permissions`
  - **Campos requeridos**: roleId, permissionIds (array de UUIDs)

## Autenticación y Autorización

### Flujo de Autenticación
1. **Login**: POST `/auth/login` con email y password
2. **Respuesta**: Token JWT + información del usuario y permisos
3. **Uso**: Incluir token en header `Authorization: Bearer <token>`

### Validación de Permisos
- Todos los endpoints (excepto login) requieren autenticación
- El `PermissionGuard` valida automáticamente los permisos requeridos
- Los permisos se validan contra la base de datos en tiempo real
- Respuesta 403 si el usuario no tiene permisos suficientes

### Ejemplos de Uso

#### Crear una tarea
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar API",
    "description": "Desarrollar endpoints REST",
    "estimatedHours": 8,
    "dueDate": "2024-01-15T23:59:59Z",
    "cost": 500.00
  }'
```

#### Obtener estadísticas
```bash
curl -X GET http://localhost:3000/statistics/tasks \
  -H "Authorization: Bearer <token>"
```

#### Asignar usuarios a tarea
```bash
curl -X PATCH http://localhost:3000/tasks/123/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedUserIds": ["user1-uuid", "user2-uuid"]
  }'
```

## Consideraciones de Seguridad

1. **Validación de Tokens**: Los tokens JWT se validan en cada request
2. **Permisos Granulares**: Control fino sobre qué puede hacer cada usuario
3. **Validación de Base de Datos**: Los permisos se validan contra la base de datos en tiempo real
4. **Auditoría**: Se puede agregar logging para auditoría de accesos
5. **Rate Limiting**: Se puede combinar con rate limiting para mayor seguridad

## Características de la Arquitectura

- **Autenticación JWT**: Sistema robusto de autenticación con tokens JWT
- **Autorización Basada en Permisos**: Control granular de acceso usando permisos específicos
- **Gestión de Sesiones**: Manejo centralizado de sesiones de usuario
- **Value Objects**: Uso de value objects para encapsular lógica de dominio
- **Inyección de Dependencias**: Uso de DI para facilitar testing y mantenimiento
- **Manejo de Excepciones**: Excepciones específicas del dominio para mejor debugging
