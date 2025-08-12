export class RoleSummary {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly permissions: string[],
    public readonly createdAt: Date,
  ) {}
}

export class ListRolesResponse {
  constructor(public readonly roles: RoleSummary[]) {}
}
