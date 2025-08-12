export class UpdateUserResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly roleName: string,
    public readonly updatedAt: Date,
  ) {}
}
