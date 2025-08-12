export class GetUserResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roleName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
