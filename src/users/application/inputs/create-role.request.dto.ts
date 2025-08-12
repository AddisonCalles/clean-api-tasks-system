export class CreateRoleRequest {
  constructor(
    public readonly name: string,
    public readonly description?: string,
  ) {}
}
