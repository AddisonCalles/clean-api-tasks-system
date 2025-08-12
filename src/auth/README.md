# Arquitectura de Autorización Basada en Permisos

## Descripción General

Esta arquitectura implementa un sistema de autorización basado únicamente en permisos siguiendo los principios de Clean Architecture. Permite validar el acceso a endpoints basándose en los permisos del usuario autenticado, utilizando los repositorios existentes de usuarios y permisos.

## Estructura de la Arquitectura

### Capa de Dominio (Domain)

#### Value Objects
- **`PermissionRequirement`**: Representa un requisito de permiso específico
- **`AuthorizationContext`**: Encapsula el contexto de autorización (usuario y permisos)

#### Excepciones
- **`AuthorizationException`**: Excepción base para errores de autorización
- **`InsufficientPermissionsException`**: Cuando el usuario no tiene permisos suficientes
- **`InvalidAuthorizationContextException`**: Cuando el contexto de autorización es inválido

### Capa de Aplicación (Application)

#### Casos de Uso
- **`AuthorizeUserUseCase`**: Valida si un usuario tiene los permisos requeridos

#### DTOs
- **`AuthorizeUserRequest/Response`**: Para autorización directa de usuarios

#### Puertos
- **`AuthorizationPort`**: Interfaz para servicios de autorización

### Capa de Infraestructura (Infrastructure)

#### Servicios
- **`AuthorizationAPIService`**: Implementa la lógica de autorización usando los repositorios existentes

#### Guards
- **`PermissionGuard`**: Guard de NestJS que valida permisos en endpoints

#### Decoradores
- **`RequirePermissions`**: Decorador principal para especificar permisos requeridos
- **Decoradores específicos**: `RequireCreateTask`, `RequireEditUser`, etc.

## Permisos Disponibles

Basándose en la migración `1754788118467-create_users.migration..ts`, los siguientes permisos están disponibles:

### Permisos de Tareas
- `create_task`: Crear nuevas tareas
- `edit_task`: Editar tareas existentes
- `delete_task`: Eliminar tareas
- `assign_users_task`: Asignar usuarios a tareas
- `view_all_tasks`: Ver todas las tareas del sistema

### Permisos de Usuarios
- `create_user`: Crear nuevos usuarios
- `edit_user`: Editar usuarios existentes
- `delete_user`: Eliminar usuarios
- `view_user`: Ver detalles de usuarios
- `view_all_users`: Ver todos los usuarios
- `manage_users`: Gestión completa de usuarios

### Permisos de Roles y Permisos
- `manage_roles`: Gestionar roles
- `manage_permissions`: Gestionar permisos
- `manage_role_permissions`: Gestionar asignaciones de permisos a roles

### Permisos de Analytics
- `access_analytics`: Acceder a analytics del sistema

## Uso de la Arquitectura

### 1. Proteger un Endpoint

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '@auth/infrastructure/guards/permission.guard';
import { RequireViewAllTasks } from '@auth/infrastructure/decorators/permissions.decorator';

@Controller('tasks')
@UseGuards(PermissionGuard)
export class TaskController {
  
  @Get()
  @RequireViewAllTasks()
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
@RequireCreateTask()
async createTask(@Body() createTaskDto: any) {
  // Solo usuarios con permiso 'create_task'
  return { message: 'Task created' };
}

@Put(':id')
@RequireEditTask()
async updateTask(@Param('id') id: string, @Body() updateTaskDto: any) {
  // Solo usuarios con permiso 'edit_task'
  return { message: 'Task updated' };
}
```

### 4. Acceder a Información del Usuario

```typescript
@Get('profile')
@RequireViewUser()
async getProfile(@Req() request: any) {
  // El guard agrega información del usuario al request
  const user = request.user;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };
}
```

## Flujo de Autorización

1. **Request llega al endpoint**
2. **PermissionGuard intercepta la request**
3. **Extrae el token JWT del header Authorization**
4. **Valida la sesión usando SessionManager**
5. **Obtiene los permisos del usuario desde la base de datos usando RolePermissionRepository**
6. **Compara con los permisos requeridos del decorador**
7. **Si tiene permisos suficientes, permite el acceso**
8. **Si no tiene permisos, lanza ForbiddenException**

## Integración con Repositorios Existentes

La arquitectura utiliza los repositorios existentes:

- **`UserRepository`**: Para obtener información del usuario
- **`RolePermissionRepository`**: Para obtener los permisos del usuario basándose en su rol
- **`PermissionRepository`**: Para validar permisos existentes

### Ejemplo de Consulta de Permisos

```typescript
// En AuthorizationAPIService
public async getUserPermissions(userId: string): Promise<string[]> {
  const user = await this.userRepository.findById(new UserId(userId));
  if (!user) {
    return [];
  }

  const rolePermissions = await this.rolePermissionRepository.findByRoleId(
    user.roleId,
  );

  return rolePermissions?.map((rp) => rp.permissionId?.value) ?? [];
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

## Ventajas de esta Arquitectura Simplificada

1. **Simplicidad**: Sistema basado únicamente en permisos, sin políticas complejas
2. **Integración Directa**: Utiliza los repositorios existentes sin duplicación
3. **Rendimiento**: Consultas directas a la base de datos sin capas adicionales
4. **Mantenibilidad**: Código más simple y fácil de entender
5. **Flexibilidad**: Fácil agregar nuevos permisos y decoradores
6. **Escalabilidad**: Se puede extender fácilmente para nuevos tipos de recursos

## Consideraciones de Seguridad

1. **Validación de Tokens**: Los tokens JWT se validan en cada request
2. **Permisos Granulares**: Control fino sobre qué puede hacer cada usuario
3. **Validación de Base de Datos**: Los permisos se validan contra la base de datos en tiempo real
4. **Auditoría**: Se puede agregar logging para auditoría de accesos
5. **Rate Limiting**: Se puede combinar con rate limiting para mayor seguridad

## Diferencias con la Versión Anterior

- **Eliminación de Políticas**: No hay políticas de autorización complejas
- **Uso Directo de Repositorios**: Utiliza directamente `UserRepository` y `RolePermissionRepository`
- **Simplificación de Contexto**: El contexto de autorización solo incluye usuario y permisos
- **Menos Capas**: Eliminación de adaptadores y repositorios adicionales
- **Mejor Rendimiento**: Menos consultas y validaciones innecesarias
