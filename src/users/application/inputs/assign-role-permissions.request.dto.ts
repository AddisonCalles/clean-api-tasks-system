import { EntityID } from "@shared/domain/value-objects";

export class AssignRolePermissionsRequest {
  constructor(
    public readonly roleId: EntityID,
    public readonly permissionIds: EntityID[],
  ) {}
}
