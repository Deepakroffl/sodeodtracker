// Task Controller — business logic for task operations
const pool = require('../database/db');

// GET /api/tasks?date=YYYY-MM-DD
async function getTasksByDate(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'date query parameter is required' });
    }

    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE task_date = $1
       ORDER BY created_at DESC`,
      [date]
    );

    res.json({ tasks: result.rows });
  } catch (err) {
    console.error('getTasksByDate error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/tasks/stats?date=YYYY-MM-DD
async function getTaskStats(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'date query parameter is required' });
    }

    const result = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'planned') AS planned,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed,
         COUNT(*) FILTER (WHERE status = 'pending') AS pending,
         COUNT(*) FILTER (WHERE status = 'carried_forward') AS carried_forward,
         COUNT(*) AS total
       FROM tasks
       WHERE task_date = $1`,
      [date]
    );

    const stats = result.rows[0];
    res.json({
      planned: parseInt(stats.planned, 10),
      completed: parseInt(stats.completed, 10),
      pending: parseInt(stats.pending, 10),
      carried_forward: parseInt(stats.carried_forward, 10),
      total: parseInt(stats.total, 10),
    });
  } catch (err) {
    console.error('getTaskStats error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/tasks/:id
async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error('getTaskById error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/tasks
async function createTask(req, res) {
  try {
    const { title, description, task_date, carried_from_id } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    if (!task_date) {
      return res.status(400).json({ error: 'task_date is required' });
    }

    const result = await pool.query(
      `INSERT INTO tasks (title, description, task_date, carried_from_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), (description || '').trim(), task_date, carried_from_id || null]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (err) {
    console.error('createTask error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/tasks/:id/status
async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, eod_notes } = req.body;

    const validStatuses = ['planned', 'completed', 'pending', 'carried_forward'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE tasks
       SET status = $1, eod_notes = COALESCE($2, eod_notes)
       WHERE id = $3
       RETURNING *`,
      [status, eod_notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task: result.rows[0] });
  } catch (err) {
    console.error('updateTaskStatus error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/tasks/:id/carry-forward
async function carryForwardTask(req, res) {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { next_date } = req.body;

    if (!next_date) {
      return res.status(400).json({ error: 'next_date is required' });
    }

    await client.query('BEGIN');

    // Get original task
    const original = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (original.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = original.rows[0];

    // Mark original as carried_forward
    await client.query(
      `UPDATE tasks SET status = 'carried_forward' WHERE id = $1`,
      [id]
    );

    // Create new task for next date
    const newTask = await client.query(
      `INSERT INTO tasks (title, description, task_date, carried_from_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [task.title, task.description, next_date, id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      original_task_id: id,
      new_task: newTask.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('carryForwardTask error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task: result.rows[0] });
  } catch (err) {
    console.error('deleteTask error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getTasksByDate,
  getTaskStats,
  getTaskById,
  createTask,
  updateTaskStatus,
  carryForwardTask,
  deleteTask,
};
