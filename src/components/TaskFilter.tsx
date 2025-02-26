import React from 'react';
import { Filter, Priority, Label } from '../types';

interface TaskFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  const priorities: Priority[] = ['low', 'medium', 'high'];
  const labels: Label[] = ['bug', 'feature', 'documentation', 'design', 'enhancement'];

  return (
    <div className="task-filter">
      <div className="filter-group">
        <label>
          Priority:
          <select
            value={filter.priority || ''}
            onChange={(e) => onFilterChange({
              ...filter,
              priority: e.target.value as Priority || null,
            })}
          >
            <option value="">All</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-group">
        <label>
          Label:
          <select
            value={filter.label || ''}
            onChange={(e) => onFilterChange({
              ...filter,
              label: e.target.value as Label || null,
            })}
          >
            <option value="">All</option>
            {labels.map(label => (
              <option key={label} value={label}>
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default TaskFilter; 