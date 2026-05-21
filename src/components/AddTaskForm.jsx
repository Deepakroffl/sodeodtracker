import { useState } from 'react';
import { createTask } from '../services/taskService';
import { useToast } from '../context/ToastContext';

export default function AddTaskForm({ date, onAdded }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!title.trim()) {
      toast('error', 'Task title is required');
      return;
    }

    setSaving(true);
    try {
      await createTask({
        title: title.trim(),
        description: desc.trim(),
        task_date: date,
      });
      setTitle('');
      setDesc('');
      onAdded();
      toast('success', 'Task added to your day');
    } catch (err) {
      toast('error', err.message || 'Failed to add task');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="card__head">
        <h2 className="card__title">
          <span className="card__title-icon">☀️</span>
          SOD — Add Task
        </h2>
      </div>
      <div className="card__body">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="add-title">
              Task Title <span className="field__required">*</span>
            </label>
            <input
              id="add-title"
              className="field__input"
              type="text"
              placeholder="What will you work on today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              autoComplete="off"
              disabled={saving}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="add-desc">Description</label>
            <textarea
              id="add-desc"
              className="field__textarea"
              placeholder="Add details or context…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={1000}
              rows={3}
              disabled={saving}
            />
          </div>
          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={!title.trim() || saving}
          >
            {saving ? (
              <>Adding...</>
            ) : (
              <><span className="btn__icon">+</span> Add Task</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
