// Task Service — API Only (Database)
// All data is stored in PostgreSQL via the backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_URL}/api/tasks${endpoint}`;
  
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

// GET /api/tasks?date=YYYY-MM-DD
export async function getTasksByDate(date) {
  const data = await request(`?date=${date}`);
  return data.tasks || [];
}

// GET /api/tasks/stats?date=YYYY-MM-DD
export async function getStats(date) {
  return request(`/stats?date=${date}`);
}

// POST /api/tasks
export async function createTask({ title, description, task_date, carried_from_id }) {
  const data = await request('', {
    method: 'POST',
    body: JSON.stringify({ title, description, task_date, carried_from_id }),
  });
  return data.task;
}

// PUT /api/tasks/:id/status
export async function updateStatus(id, status, eod_notes) {
  const data = await request(`/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, eod_notes }),
  });
  return data.task;
}

// POST /api/tasks/:id/carry-forward
export async function carryForward(id, nextDate) {
  const data = await request(`/${id}/carry-forward`, {
    method: 'POST',
    body: JSON.stringify({ next_date: nextDate }),
  });
  return data.new_task;
}

// DELETE /api/tasks/:id
export async function deleteTask(id) {
  await request(`/${id}`, { method: 'DELETE' });
  return true;
}
