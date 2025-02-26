export type Priority = 'low' | 'medium' | 'high';
export type Label = 'bug' | 'feature' | 'documentation' | 'design' | 'enhancement';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  labels: Label[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Filter {
  priority: Priority | null;
  label: Label | null;
} 