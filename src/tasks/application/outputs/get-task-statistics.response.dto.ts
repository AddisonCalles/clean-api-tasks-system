export class TaskStatistics {
  constructor(
    public readonly totalTasks: number,
    public readonly completedTasks: number,
    public readonly overdueTasks: number,
    public readonly activeTasks: number,
    public readonly totalCost: number,
    public readonly efficiencyPercentage: number,
  ) {}
}

export class GetTaskStatisticsResponse {
  constructor(
    public readonly statistics: TaskStatistics,
    public readonly userId?: string,
  ) {}
}
