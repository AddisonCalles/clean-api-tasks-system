export class UserSummary {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roleName: string,
    public readonly createdAt: Date,
  ) {}
}

export class ListUsersResponse {
  constructor(
    public readonly users: UserSummary[],
    public readonly total: number,
    public readonly limit: number,
    public readonly offset: number,
  ) {}
}
