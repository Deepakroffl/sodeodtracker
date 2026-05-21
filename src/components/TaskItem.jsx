import { useState } from 'react';
import { updateStatus, carryForward, deleteTask } from '../services/taskService';
import { getNextDay } from '../utils/dateUtils';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

const STATUS_LABELS = {
  planned: 'Planned',
  completed: 'Completed',
  pending: 'Pending',
  carried_forward: 'Carried Forward',
};

export default function TaskItem({ task, onUpdate }) {
  const [notes, setNotes] = useState(task.eod_notes || '');
  const [showNotes, setShowNotes] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  async function markCompleted() {
    setBusy(true);
    try {
      await updateStatus(task.id, 'completed', notes);
      toast('success', `"${task.title}" completed!`);
      onUpdate();
    } catch (err) {
      toast('error', err.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  }

  async function markPending() {
    setBusy(true);
    try {
      await updateStatus(task.id, 'pending', notes);
      toast('info', `"${task.title}" set to pending`);
      onUpdate();
    } catch (err) {
      toast('error', err.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  }

  async function saveNotes() {
    setBusy(true);
    try {
      await updateStatus(task.id, task.status, notes);
      toast('success', 'EOD notes saved');
      setShowNotes(false);
      onUpdate();
    } catch (err) {
      toast('error', err.message || 'Failed to save notes');
    } finally {
      setBusy(false);
    }
  }

  async function doCarry() {
    setBusy(true);
    try {
      await carryForward(task.id, getNextDay(task.task_date));
      toast('success', `"${task.title}" carried to next day`);
      setConfirm(null);
      onUpdate();
    } catch (err) {
      toast('error', err.message || 'Failed to carry forward');
    } finally {
      setBusy(false);
    }
  }

  async function doDelete() {
    setBusy(true);
    try {
      await deleteTask(task.id);
      toast('success', 'Task deleted');
      setConfirm(null);
      onUpdate();
    } catch (err) {
      toast('error', err.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  }

  const canAct = task.status === 'planned' || task.status === 'pending';
  const canCarry = task.status === 'pending';

  return (
    <>
      <div className={`task task--${task.status}`}>
        {/* Top row */}
        <div className="task__top">
          <span className="task__title">{task.title}</span>
          <span className={`badge badge--${task.status}`}>{STATUS_LABELS[task.status]}</span>
        </div>

        {/* Description */}
        {task.description && <p className="task__desc">{task.description}</p>}

        {/* Carried label */}
        {task.carried_from_id && (
          <div className="task__carried-tag">🔄 Carried from previous day</div>
        )}

        {/* EOD Notes display */}
        {task.eod_notes && !showNotes && (
          <div className="task__notes">
            <span className="task__notes-label">EOD Notes:</span>
            {task.eod_notes}
          </div>
        )}

        {/* EOD Notes input */}
        {showNotes && (
          <div className="notes-input">
            <input
              className="notes-input__field"
              type="text"
              placeholder="Write your end-of-day notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              onKeyDown={(e) => e.key === 'Enter' && saveNotes()}
              autoFocus
              disabled={busy}
            />
            <button className="btn btn--primary btn--sm" onClick={saveNotes} disabled={busy}>
              Save
            </button>
            <button className="btn btn--ghost btn--sm" onClick={() => setShowNotes(false)} disabled={busy}>
              ✕
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="task__actions">
          {canAct && (
            <button className="btn btn--success btn--sm" onClick={markCompleted} disabled={busy}>
              <span className="btn__icon">✓</span> Complete
            </button>
          )}
          {canAct && task.status !== 'pending' && (
            <button className="btn btn--warning btn--sm" onClick={markPending} disabled={busy}>
              <span className="btn__icon">⏳</span> Pending
            </button>
          )}
          {canCarry && (
            <button className="btn btn--carried btn--sm" onClick={() => setConfirm('carry')} disabled={busy}>
              <span className="btn__icon">↗</span> Carry Forward
            </button>
          )}

          <span className="task__actions-spacer" />

          <button className="btn btn--ghost btn--sm" onClick={() => setShowNotes(!showNotes)} disabled={busy}>
            <span className="btn__icon">📝</span> Notes
          </button>
          <button className="btn btn--danger btn--sm" onClick={() => setConfirm('delete')} disabled={busy}>
            <span className="btn__icon">🗑</span> Delete
          </button>
        </div>
      </div>

      {/* Modals */}
      {confirm === 'delete' && (
        <ConfirmDialog
          icon="🗑️"
          title="Delete Task"
          message={`Permanently delete "${task.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          confirmClass="btn--danger"
          onConfirm={doDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'carry' && (
        <ConfirmDialog
          icon="🔄"
          title="Carry Forward"
          message={`Move "${task.title}" to tomorrow? The original stays as a historical record.`}
          confirmLabel="Carry Forward"
          confirmClass="btn--carried"
          onConfirm={doCarry}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
