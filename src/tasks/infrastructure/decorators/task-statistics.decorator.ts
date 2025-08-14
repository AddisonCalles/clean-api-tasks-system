import { RequirePermissions } from '@auth/infrastructure/decorators/permissions.decorator';
import { PermissionNameEnum } from '@users/domain/value-objects';

export const RequiredViewTaskStatisticsPermissions = () =>
  RequirePermissions(PermissionNameEnum.VIEW_TASK_STATISTICS);
