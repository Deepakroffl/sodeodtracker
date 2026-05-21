export default function ConfirmDialog({ icon, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon">{icon}</div>
        <h3 className="modal__title">{title}</h3>
        <p className="modal__text">{message}</p>
        <div className="modal__btns">
          <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${confirmClass || 'btn--danger'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
