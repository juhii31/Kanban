import React, { useState } from 'react';
import { Column, Task, Priority, Label } from '../types';

interface BoardProps {
  columns: Column[];
  onAddTask: (columnId: string, title: string) => void;
  onEditTask: (columnId: string, taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
}

const Board: React.FC<BoardProps> = ({ 
  columns, 
  onAddTask, 
  onEditTask, 
  onDeleteTask, 
  onMoveTask 
}) => {
  const [editingTask, setEditingTask] = useState<{id: string, columnId: string} | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, fromColumnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColumnId', fromColumnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => {
    e.preventDefault();
    try {
      const taskId = e.dataTransfer.getData('taskId');
      const fromColumnId = e.dataTransfer.getData('fromColumnId');
      
      if (!taskId || !fromColumnId) {
        console.error('Missing drag data');
        return;
      }
      
      if (fromColumnId !== toColumnId) {
        onMoveTask(taskId, fromColumnId, toColumnId);
      }
    } catch (error) {
      console.error('Error during drag and drop:', error);
    }
  };

  const priorities: Priority[] = ['low', 'medium', 'high'];
  const labels: Label[] = ['bug', 'feature', 'documentation', 'design', 'enhancement'];

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const renderTask = (task: Task, columnId: string): JSX.Element => {
    const isEditing = editingTask?.id === task.id;

    if (isEditing) {
      return (
        <div className="task task-edit" key={task.id}>
          <input
            type="text"
            value={task.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              onEditTask(columnId, task.id, { title: e.target.value })}
          />
          <textarea
            value={task.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              onEditTask(columnId, task.id, { description: e.target.value })}
            placeholder="Description"
          />
          <div className="task-edit-controls">
            <select
              value={task.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                onEditTask(columnId, task.id, { priority: e.target.value as Priority })}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select
              multiple
              value={task.labels}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const options = e.target.selectedOptions;
                const selectedLabels: Label[] = [];
                for (let i = 0; i < options.length; i++) {
                  const value = options[i].value as Label;
                  selectedLabels.push(value);
                }
                onEditTask(columnId, task.id, { labels: selectedLabels });
              }}
            >
              {labels.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
            <input
              type="date"
              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onEditTask(columnId, task.id, { 
                  dueDate: e.target.value ? new Date(e.target.value) : null 
                })}
            />
            <button onClick={() => setEditingTask(null)}>Save</button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={task.id}
        className="task"
        draggable
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task.id, columnId)}
      >
        <div className="task-header">
          <h3>{task.title}</h3>
          <div className="task-actions">
            <button onClick={() => setEditingTask({ id: task.id, columnId })}>Edit</button>
            <button onClick={() => onDeleteTask(columnId, task.id)}>Delete</button>
          </div>
        </div>
        <p>{task.description}</p>
        <div className="task-metadata">
          <div 
            className="priority-indicator"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </div>
          <div className="labels">
            {task.labels.map(label => (
              <span key={label} className="label">{label}</span>
            ))}
          </div>
          {task.dueDate && (
            <div className="due-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="board">
      {columns.map(column => (
        <div
          key={column.id}
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h2>{column.title}</h2>
          <div className="tasks">
            {column.tasks.map(task => renderTask(task, column.id))}
          </div>
          <button
            onClick={() => {
              const title = window.prompt('Enter task title:');
              if (title) onAddTask(column.id, title);
            }}
          >
            + Add Task
          </button>
        </div>
      ))}
    </div>
  );
};

export default Board; 