export type Status = 'pending' | 'in_progress' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  category?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PriorityStat {
  priority: Priority;
  count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  priorityStats: PriorityStat[];
  categoryStats: CategoryStat[];
}
