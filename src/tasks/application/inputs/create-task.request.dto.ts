export class CreateTaskRequest {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly estimatedHours: number,
    public readonly dueDate: Date,
    public readonly cost: number,
    public readonly assignedUserIds: string[],
    public readonly createdBy: string,
  ) {}
}
