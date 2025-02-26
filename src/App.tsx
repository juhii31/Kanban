import React, { useState } from 'react';
import Board from './components/Board';
import TaskFilter from './components/TaskFilter';
import { Task, Column, Filter, Priority, Label } from './types';

const App: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', title: 'To Do', tasks: [] },
    { id: '2', title: 'In Progress', tasks: [] },
    { id: '3', title: 'Done', tasks: [] },
  ]);

  const [filter, setFilter] = useState<Filter>({
    priority: null,
    label: null,
  });

  const addTask = (columnId: string, title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: '',
      dueDate: null,
      priority: 'medium',
      labels: [],
    };

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, newTask] };
      }
      return col;
    }));
  };

  const editTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      }
      return col;
    }));
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId),
        };
      }
      return col;
    }));
  };

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    setColumns(columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
      }
      if (col.id === toColumnId) {
        const task = columns.find(c => c.id === fromColumnId)?.tasks.find(t => t.id === taskId);
        if (task) {
          return { ...col, tasks: [...col.tasks, task] };
        }
      }
      return col;
    }));
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.label && !task.labels.includes(filter.label)) return false;
      return true;
    }),
  }));

  return (
    <div className="app">
      <header>
        <h1>Kanban Board</h1>
        <TaskFilter filter={filter} onFilterChange={setFilter} />
      </header>
      <Board 
        columns={filteredColumns} 
        onAddTask={addTask} 
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onMoveTask={moveTask} 
      />
    </div>
  );
};

export default App; 