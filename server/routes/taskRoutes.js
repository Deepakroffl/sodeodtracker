// Task Routes — RESTful API endpoints
const express = require('express');
const router = express.Router();
const {
  getTasksByDate,
  getTaskStats,
  getTaskById,
  createTask,
  updateTaskStatus,
  carryForwardTask,
  deleteTask,
} = require('../controllers/taskController');

// GET /api/tasks?date=YYYY-MM-DD       — List tasks for a date
router.get('/', getTasksByDate);

// GET /api/tasks/stats?date=YYYY-MM-DD — Get stats for a date
router.get('/stats', getTaskStats);

// GET /api/tasks/:id                   — Get single task
router.get('/:id', getTaskById);

// POST /api/tasks                      — Create new task
router.post('/', createTask);

// PUT /api/tasks/:id/status            — Update task status + EOD notes
router.put('/:id/status', updateTaskStatus);

// POST /api/tasks/:id/carry-forward    — Carry task to next day
router.post('/:id/carry-forward', carryForwardTask);

// DELETE /api/tasks/:id                — Delete task
router.delete('/:id', deleteTask);

module.exports = router;
