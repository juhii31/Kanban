import React from 'react';
import { Filter, Priority, Label } from '../types';

interface TaskFilterProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ filter, onFilterChange }) => {
  const priorities: Priority[] = ['low', 'medium', 'high'];
  const labels: Label[] = ['bug', 'feature', 'documentation', 'design', 'enhancement'];

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Priority | '';
    console.log('[FILTER] Setting priority filter:', value || 'none');
    onFilterChange({
      ...filter,
      priority: value || null,
    });
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Label | '';
    console.log('[FILTER] Setting label filter:', value || 'none');
    onFilterChange({
      ...filter,
      label: value || null,
    });
  };

  const clearFilters = () => {
    console.log('[FILTER] Clearing all filters');
    onFilterChange({
      priority: null,
      label: null,
    });
  };

  return (
    <div className="task-filter">
      <div className="filter-group">
        <label>
          Priority:
          <select
            value={filter.priority || ''}
            onChange={handlePriorityChange}
          >
            <option value="">Show All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                Show {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Only
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
            onChange={handleLabelChange}
          >
            <option value="">Show All Labels</option>
            {labels.map(label => (
              <option key={label} value={label}>
                Show {label.charAt(0).toUpperCase() + label.slice(1)} Only
              </option>
            ))}
          </select>
        </label>
      </div>

      {(filter.priority || filter.label) && (
        <button 
          onClick={clearFilters}
          className="clear-filters-button"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilter; 