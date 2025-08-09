## I. Objetivo del Challenge

Desarrollar una API para la gestión de tareas dentro de un equipo, permitiendo:

- La creación de usuarios
- La asignación de tareas con fechas de entrega
- La manipulación de datos numéricos asociados a las tareas (estimaciones de tiempo y seguimiento del tiempo invertido)

---

## II. Especificaciones Técnicas

- Back-end con **NodeJS** y **NestJS**
- Base de datos en **PostgreSQL**
- Uso obligatorio de **TypeScript**
- **Autenticación con JWT** para proteger todos los endpoints
- **Soft Delete** en todas las entidades para mantener integridad de datos

---

## III. Estructura de Datos Optimizada

### 1. Autenticación y Usuarios

#### Tabla: `usuarios`
```sql
- id (UUID, PK)
- nombre (VARCHAR, NOT NULL)
- correo_electronico (VARCHAR, UNIQUE, NOT NULL)
- password_hash (VARCHAR, NOT NULL)
- rol_id (UUID, FK a roles.id)
- tareas_terminadas_conteo (INTEGER, DEFAULT 0) -- Campo optimizado
- tareas_terminadas_costo_total (DECIMAL, DEFAULT 0) -- Campo optimizado
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL) -- Soft delete
```

#### Tabla: `roles`
```sql
- id (UUID, PK)
- nombre (VARCHAR, UNIQUE, NOT NULL) -- 'administrador', 'miembro'
- descripcion (TEXT)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL)
```

#### Tabla: `permisos`
```sql
- id (UUID, PK)
- nombre (VARCHAR, UNIQUE, NOT NULL) -- 'crear_tarea', 'editar_tarea', 'eliminar_tarea', etc.
- descripcion (TEXT)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL)
```

#### Tabla: `roles_permisos` (Tabla de relación)
```sql
- id (UUID, PK)
- rol_id (UUID, FK a roles.id)
- permiso_id (UUID, FK a permisos.id)
- created_at (TIMESTAMP, DEFAULT NOW())
```

### 2. Gestión de Tareas

#### Tabla: `estados_tarea` (Catálogo)
```sql
- id (UUID, PK)
- nombre (VARCHAR, UNIQUE, NOT NULL) -- 'activa', 'terminada', 'en_progreso', 'cancelada'
- descripcion (TEXT)
- color (VARCHAR) -- Para UI
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL)
```

#### Tabla: `tareas`
```sql
- id (UUID, PK)
- titulo (VARCHAR, NOT NULL)
- descripcion (TEXT)
- estimacion_horas (DECIMAL, NOT NULL)
- tiempo_invertido (DECIMAL, DEFAULT 0) -- Campo adicional para seguimiento
- fecha_vencimiento (DATE, NOT NULL)
- fecha_finalizacion (TIMESTAMP, NULL) -- Se registra automáticamente al terminar
- estado_id (UUID, FK a estados_tarea.id)
- costo_monetario (DECIMAL, NOT NULL)
- created_by (UUID, FK a usuarios.id) -- Quién creó la tarea
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL)
```

#### Tabla: `tareas_usuarios` (Tabla de relación)
```sql
- id (UUID, PK)
- tarea_id (UUID, FK a tareas.id)
- usuario_id (UUID, FK a usuarios.id)
- created_at (TIMESTAMP, DEFAULT NOW())
- deleted_at (TIMESTAMP, NULL)
```

### 3. Historial de Cambios

#### Tabla: `historial_cambios_tarea`
```sql
- id (UUID, PK)
- tarea_id (UUID, FK a tareas.id)
- usuario_id (UUID, FK a usuarios.id) -- Quién hizo el cambio
- campo_modificado (VARCHAR, NOT NULL) -- 'estado', 'titulo', 'usuarios_asignados', etc.
- valor_anterior (TEXT)
- valor_nuevo (TEXT)
- created_at (TIMESTAMP, DEFAULT NOW())
```

---

## IV. Optimizaciones de Rendimiento

### 1. Campos Pre-calculados
- **Campos optimizados en usuarios**: `tareas_terminadas_conteo` y `tareas_terminadas_costo_total`
- **Beneficio**: Respuesta instantánea en listado de usuarios sin cálculos en tiempo real

### 2. Transacciones para Consistencia
- **Operación atómica**: Al marcar tarea como terminada, actualizar estado + contadores de usuarios
- **Beneficio**: Previene inconsistencias en datos

### 3. Índices Recomendados
```sql
-- Para búsquedas rápidas
CREATE INDEX idx_usuarios_correo ON usuarios(correo_electronico);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_tareas_estado ON tareas(estado_id);
CREATE INDEX idx_tareas_vencimiento ON tareas(fecha_vencimiento);
CREATE INDEX idx_tareas_created_at ON tareas(created_at);
CREATE INDEX idx_historial_tarea ON historial_cambios_tarea(tarea_id);
```

---

## V. Lógica de Negocio y Permisos

### 1. Autenticación
- **JWT Tokens**: Protección de todos los endpoints
- **Refresh Tokens**: Para renovación automática de sesiones
- **Middleware de autorización**: Verificación de permisos por rol

### 2. Permisos por Rol

#### Administrador
- ✅ Crear, editar, eliminar cualquier tarea
- ✅ Asignar/reasignar usuarios a cualquier tarea
- ✅ Ver todas las tareas del sistema
- ✅ Gestionar usuarios (crear, editar, eliminar)
- ✅ Acceso completo a analíticas

#### Miembro
- ✅ Ver solo tareas asignadas a sí mismo
- ✅ Actualizar tiempo invertido en sus tareas
- ✅ Marcar sus tareas como terminadas
- ❌ No puede eliminar tareas
- ❌ No puede asignar usuarios a tareas
- ❌ No puede ver tareas de otros usuarios

### 3. Flujos de Trabajo

#### Creación de Tarea
1. Solo administradores pueden crear tareas
2. Se registra automáticamente el `created_by`
3. Se crea entrada en historial de cambios

#### Actualización de Tarea
1. Se registra cada cambio en `historial_cambios_tarea`
2. Al cambiar estado a "terminada":
   - Se actualiza `fecha_finalizacion`
   - Se actualizan contadores de usuarios asignados
   - Todo en transacción atómica

#### Eliminación de Usuario
1. **Soft delete**: No se eliminan físicamente
2. **Tareas asignadas**: Se mantienen pero se marcan como "sin asignar"
3. **Historial**: Se preserva para auditoría

---

## VI. Endpoints de Analítica

### 1. Eficiencia del Equipo
- **Comparativa**: Horas estimadas vs horas reales invertidas
- **Métrica**: Porcentaje de precisión en estimaciones
- **Filtros**: Por usuario, por período, por proyecto

### 2. Tareas con Retraso
- **Conteo**: Tareas activas con fecha de vencimiento vencida
- **Detalle**: Lista de tareas retrasadas con días de retraso
- **Alertas**: Para administradores sobre tareas críticas

---

## VII. Reto (Actualizado)

### 1. Usuarios

- **a. Crear usuarios**
  - Campos requeridos: `nombre`, `correo electrónico`, `password`, `rol`
  - **Validación**: Correo único, password mínimo 8 caracteres

- **b. Autenticación**
  - **Login**: POST `/auth/login` con correo y password
  - **Refresh**: POST `/auth/refresh` para renovar tokens
  - **Logout**: POST `/auth/logout` para invalidar tokens

- **c. Listar usuarios**
  - Soportar filtros por: `nombre`, `correo` y `rol`
  - Incluir por usuario:
    - Cantidad de tareas terminadas (campo pre-calculado)
    - Suma del costo de todas las tareas terminadas (campo pre-calculado)
    - **Rendimiento**: Respuesta instantánea gracias a campos optimizados

---

### 2. Tareas

- **a. Crear tareas**
  - Campos requeridos:
    - `título`
    - `descripción`
    - `estimación de horas`
    - `fecha de vencimiento`
    - `estado` (catálogo de estados)
    - `usuarios asignados` (uno o más)
    - `costo monetario`
  - **Permisos**: Solo administradores

- **b. Listar tareas**
  - Orden: de más reciente a menos reciente
  - Filtros combinables por:
    - `fecha de vencimiento`
    - `nombre de tarea`
    - `usuario asignado`
    - `nombre` y/o `correo del usuario asignado`
    - `estado`
  - **Permisos**: Administradores ven todas, miembros solo las suyas

- **c. Actualizar tareas**
  - Permitir cambios en:
    - Cualquier campo
    - Reasignación de usuarios (solo administradores)
    - Estimación de horas
    - Tiempo invertido (miembros pueden actualizar en sus tareas)
  - **Historial**: Registro automático de todos los cambios

- **d. Eliminar tareas**
  - **Soft delete**: No eliminación física
  - **Permisos**: Solo administradores

- **e. Endpoint de analítica**
  - **Eficiencia del equipo**: Comparativa horas estimadas vs reales
  - **Tareas con retraso**: Conteo y detalle de tareas vencidas
  - **Filtros**: Por período, usuario, estado

---

## VIII. Consideraciones Técnicas Adicionales

### 1. Validaciones
- **Correo único**: Validación a nivel de base de datos
- **Password**: Mínimo 8 caracteres, hash con bcrypt
- **Fechas**: Validación de fechas de vencimiento futuras
- **Costos**: Validación de valores positivos

### 2. Seguridad
- **Rate limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración apropiada para frontend
- **Helmet**: Headers de seguridad
- **Validación de entrada**: Sanitización de datos

### 3. Logging y Monitoreo
- **Logs estructurados**: Para auditoría y debugging
- **Métricas**: Tiempo de respuesta, errores, uso de recursos
- **Health checks**: Endpoints para monitoreo de salud

### 4. Testing
- **Unit tests**: Para lógica de negocio
- **Integration tests**: Para endpoints y base de datos
- **E2E tests**: Para flujos completos de usuario
