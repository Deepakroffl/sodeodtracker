import { useToast } from '../context/ToastContext';

const ICONS = { success: '✓', error: '✕', info: 'ℹ' };
const ICON_STYLES = {
  success: { background: '#ecfdf5', color: '#047857', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 },
  error:   { background: '#fef2f2', color: '#dc2626', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 },
  info:    { background: '#eef2ff', color: '#4f46e5', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 },
};

export default function Toasts() {
  const { toasts, remove } = useToast();
  if (!toasts.length) return null;

  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__icon" style={ICON_STYLES[t.type]}>{ICONS[t.type]}</span>
          <span className="toast__msg">{t.message}</span>
          <button className="toast__close" onClick={() => remove(t.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
}
