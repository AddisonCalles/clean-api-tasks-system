export interface TaskListItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  timeSpent: number;
  dueDate: Date;
  completionDate: Date | null;
  status: string;
  cost: number;
  assignedUsers: {
    userId: string;
    email: string;
    assignedAt: Date;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  efficiencyPercentage: number;
}
export class ListTasksResponse {
  constructor(
    public readonly tasks: TaskListItem[],
    public readonly total: number,
  ) {}
}
