import { useState } from 'react';
import TaskItem from './TaskItem';

const FILTERS = [
  { key: 'all',             label: 'All' },
  { key: 'planned',         label: 'Planned' },
  { key: 'completed',       label: 'Completed' },
  { key: 'pending',         label: 'Pending' },
  { key: 'carried_forward', label: 'Carried' },
];

export default function TaskList({ tasks, onUpdate, loading }) {
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  return (
    <div className="card">
      <div className="card__head">
        <h2 className="card__title">
          <span className="card__title-icon">📋</span>
          Task List
          <span className="card__count">{visible.length}</span>
        </h2>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`filters__btn ${filter === f.key ? 'filters__btn--active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.key !== 'all' && <span className={`filters__dot filters__dot--${f.key}`} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="empty">
          <div className="empty__icon">⏳</div>
          <div className="empty__title">Loading tasks...</div>
          <div className="empty__text">Please wait</div>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <div className="empty__icon">{filter === 'all' ? '📭' : '🔍'}</div>
          <div className="empty__title">
            {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
          </div>
          <div className="empty__text">
            {filter === 'all'
              ? 'Start your day by adding tasks with the SOD form.'
              : 'Try selecting a different filter.'}
          </div>
        </div>
      ) : (
        <div className="tasks">
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
