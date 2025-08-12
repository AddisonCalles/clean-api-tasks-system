export class ListUsersRequest {
  constructor(
    public readonly name?: string,
    public readonly email?: string,
    public readonly roleName?: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {}
}
