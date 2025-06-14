export interface Task {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
