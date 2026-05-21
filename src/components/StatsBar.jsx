const ITEMS = [
  { key: 'planned',   icon: '📝', label: 'Planned' },
  { key: 'completed', icon: '✅', label: 'Completed' },
  { key: 'pending',   icon: '⏳', label: 'Pending' },
  { key: 'carried',   icon: '🔄', label: 'Carried' },
];

export default function StatsBar({ stats }) {
  const counts = {
    planned: stats.planned,
    completed: stats.completed,
    pending: stats.pending,
    carried: stats.carried_forward,
  };

  return (
    <div className="stats">
      {ITEMS.map((item) => (
        <div key={item.key} className={`stat stat--${item.key}`}>
          <div className="stat__icon">{item.icon}</div>
          <div className="stat__info">
            <div className="stat__number">{counts[item.key]}</div>
            <div className="stat__label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
