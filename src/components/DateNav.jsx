import { getToday, getNextDay, getPrevDay, isToday } from '../utils/dateUtils';

export default function DateNav({ date, onChange }) {
  return (
    <div className="date-nav">
      <button
        className="date-nav__arrow"
        onClick={() => onChange(getPrevDay(date))}
        aria-label="Previous day"
      >
        ‹
      </button>

      <div className="date-nav__input-wrap">
        <input
          type="date"
          className="date-nav__input"
          value={date}
          onChange={(e) => e.target.value && onChange(e.target.value)}
        />
      </div>

      <button
        className="date-nav__arrow"
        onClick={() => onChange(getNextDay(date))}
        aria-label="Next day"
      >
        ›
      </button>

      {!isToday(date) && (
        <button
          className="date-nav__today"
          onClick={() => onChange(getToday())}
        >
          Today
        </button>
      )}
    </div>
  );
}
