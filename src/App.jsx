import { useState, useCallback, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import Toasts from './components/Toasts';
import DateNav from './components/DateNav';
import StatsBar from './components/StatsBar';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { getTasksByDate, getStats } from './services/taskService';
import { getToday, formatDateLong, isToday } from './utils/dateUtils';

function Dashboard() {
  const [date, setDate] = useState(getToday());
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    planned: 0,
    completed: 0,
    pending: 0,
    carried_forward: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasksByDate(date),
        getStats(date),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app">
      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand">
            <div className="topbar__logo">📋</div>
            <div>
              <div className="topbar__title">SOD & EOD Tracker</div>
              <div className="topbar__subtitle">Plan · Execute · Review</div>
            </div>
          </div>
          <DateNav date={date} onChange={setDate} />
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Date Display */}
        <div className="date-display">
          <span className="date-display__day">{formatDateLong(date)}</span>
          {isToday(date) && <span className="date-display__today-badge">Today</span>}
        </div>

        {/* Statistics */}
        <StatsBar stats={stats} />

        {/* Content Grid */}
        <div className="content">
          <AddTaskForm date={date} onAdded={fetchData} />
          <TaskList tasks={tasks} onUpdate={fetchData} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
      <Toasts />
    </ToastProvider>
  );
}
