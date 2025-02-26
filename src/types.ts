export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';
export type Label = 'bug' | 'feature' | 'documentation' | 'design' | 'enhancement';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  labels?: Label[];
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  tasks: Task[];
}

export interface Filter {
  priority: Priority | null;
  label: Label | null;
} 