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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const priorities: Priority[] = ['low', 'medium', 'high'];
  const labels: Label[] = ['bug', 'feature', 'documentation', 'design', 'enhancement'];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, fromColumnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColumnId', fromColumnId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId');
    
    if (fromColumnId !== toColumnId) {
      onMoveTask(taskId, fromColumnId, toColumnId);
    }
  };

  const renderTask = (task: Task, columnId: string) => {
    const isEditing = editingTaskId === task.id;

    if (isEditing && editingTask) {
      return (
        <div key={task.id} className="task editing">
          <div className="edit-section">
            <label>Title:</label>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              placeholder="Task title"
            />
          </div>

          <div className="edit-section">
            <label>Description:</label>
            <textarea
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              placeholder="Task description"
            />
          </div>

          <div className="edit-section">
            <label>Priority:</label>
            <select
              value={editingTask.priority}
              onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-section">
            <label>Labels:</label>
            <div className="label-checkboxes">
              {labels.map(label => (
                <label key={label} className="label-checkbox">
                  <input
                    type="checkbox"
                    checked={editingTask.labels?.includes(label) || false}
                    onChange={(e) => {
                      const newLabels = e.target.checked
                        ? [...(editingTask.labels || []), label]
                        : (editingTask.labels || []).filter(l => l !== label);
                      setEditingTask({ ...editingTask, labels: newLabels });
                    }}
                  />
                  <span className="label" data-label={label}>
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="task-edit-controls">
            <div className="button-group">
              <button 
                className="save-button" 
                onClick={() => {
                  onEditTask(columnId, task.id, editingTask);
                  setEditingTaskId(null);
                  setEditingTask(null);
                }}
              >
                💾 Save Changes
              </button>
              <button 
                className="cancel-button" 
                onClick={() => {
                  setEditingTaskId(null);
                  setEditingTask(null);
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={task.id}
        className={`task priority-${task.priority}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id, columnId)}
      >
        <div className="task-header">
          <h3>{task.title}</h3>
          <div className="task-actions">
            <button 
              className="edit-button" 
              onClick={() => {
                setEditingTaskId(task.id);
                setEditingTask({ ...task });
              }}
            >
              ✏️ Edit
            </button>
            <button 
              className="delete-button" 
              onClick={() => onDeleteTask(columnId, task.id)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        <p>{task.description}</p>
        {task.labels && task.labels.length > 0 && (
          <div className="labels">
            {task.labels.map(label => (
              <span key={label} className="label" data-label={label}>
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </span>
            ))}
          </div>
        )}
        <div className="task-footer">
          <span className={`priority priority-${task.priority}`}>
            {task.priority}
          </span>
          <span className="date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
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
          <div className="column-header">
            <h2>{column.title}</h2>
            <span className="task-count">({column.tasks.length})</span>
          </div>
          <div className="tasks">
            {column.tasks.map(task => renderTask(task, column.id))}
          </div>
          <button
            className="add-task-button"
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