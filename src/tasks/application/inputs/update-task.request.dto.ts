export class UpdateTaskRequest {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly estimatedHours?: number,
    public readonly timeSpent?: number,
    public readonly dueDate?: Date,
    public readonly status?: string,
    public readonly cost?: number,
    public readonly assignedUserIds?: string[],
  ) {}
}
