export class GetTaskResponse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly estimatedHours: number,
    public readonly timeSpent: number,
    public readonly dueDate: Date,
    public readonly completionDate: Date | null,
    public readonly status: string,
    public readonly cost: number,
    public readonly assignedUserIds: string[],
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isOverdue: boolean,
    public readonly efficiencyPercentage: number,
  ) {}
}
