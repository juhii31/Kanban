import React, { useState, useEffect } from 'react';
import { Task, Column, Status, Priority, Label, Filter } from './types';
import Board from './components/Board';

const App: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedData = localStorage.getItem('kanban-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.map((col: any) => ({
          ...col,
          tasks: col.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            labels: task.labels || []
          }))
        }));
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
    
    // Default columns
    return [
      {
        id: '1',
        title: 'To Do',
        status: 'todo' as Status,
        tasks: []
      },
      {
        id: '2',
        title: 'In Progress',
        status: 'in-progress' as Status,
        tasks: []
      },
      {
        id: '3',
        title: 'Done',
        status: 'done' as Status,
        tasks: []
      }
    ];
  });

  const [filter, setFilter] = useState<Filter>({
    priority: null,
    label: null
  });

  // Save to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(columns));
  }, [columns]);

  const handleAddTask = (columnId: string, title: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: '',
      status: column.status,
      priority: 'medium',
      labels: [],
      createdAt: new Date()
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const handleEditTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(t =>
              t.id === taskId
                ? { ...t, ...updates }
                : t
            )
          }
        : col
    ));
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        : col
    ));
  };

  const handleMoveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const toColumn = columns.find(col => col.id === toColumnId);
    
    if (!fromColumn || !toColumn) return;

    const task = fromColumn.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, status: toColumn.status };

    setColumns(columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      if (col.id === toColumnId) {
        return { ...col, tasks: [...col.tasks, updatedTask] };
      }
      return col;
    }));
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => {
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.label && (!task.labels || !task.labels.includes(filter.label))) return false;
      return true;
    })
  }));

  const handleFilterChange = (type: keyof Filter, value: string | null) => {
    setFilter(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilter({
      priority: null,
      label: null
    });
  };

  return (
    <div className="app">
      <header>
        <h1>Kanban Board</h1>
        <div className="task-filter">
          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filter.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || null)}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Label:</label>
            <select
              value={filter.label || ''}
              onChange={(e) => handleFilterChange('label', e.target.value || null)}
            >
              <option value="">All</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="documentation">Documentation</option>
              <option value="design">Design</option>
              <option value="enhancement">Enhancement</option>
            </select>
          </div>
          <button className="clear-filters-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </header>
      
      <Board
        columns={filteredColumns}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
      />
    </div>
  );
};

export default App; 