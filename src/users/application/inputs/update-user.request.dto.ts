export class UpdateUserRequest {
  constructor(
    public readonly name?: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly roleName?: string,
  ) {}
}
