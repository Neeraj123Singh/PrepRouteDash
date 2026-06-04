import styles from './TimeField.module.css';

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function parseTime(value: string) {
  if (!value) return { hour: '', minute: '' };
  const colon = value.indexOf(':');
  if (colon === -1) return { hour: value.replace(/\D/g, '').slice(0, 2), minute: '' };
  return {
    hour: value.slice(0, colon).replace(/\D/g, '').slice(0, 2),
    minute: value.slice(colon + 1).replace(/\D/g, '').slice(0, 2),
  };
}

function formatTime(hour: string, minute: string) {
  if (!hour && !minute) return '';
  return `${hour}:${minute}`;
}

function clampPart(raw: string, max: number) {
  if (raw === '') return '';
  const n = Math.min(max, Math.max(0, Number.parseInt(raw, 10) || 0));
  return String(n).padStart(2, '0');
}

export function TimeField({ id, label, value, onChange }: TimeFieldProps) {
  const { hour, minute } = parseTime(value);

  const updateHour = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    onChange(formatTime(digits, minute));
  };

  const updateMinute = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    onChange(formatTime(hour, digits));
  };

  const onHourBlur = () => {
    if (!hour) return;
    const h = clampPart(hour, 23);
    const m = minute ? clampPart(minute, 59) : '';
    onChange(formatTime(h, m));
  };

  const onMinuteBlur = () => {
    if (!hour && !minute) return;
    const h = hour ? clampPart(hour, 23) : '';
    const m = minute ? clampPart(minute, 59) : '';
    onChange(formatTime(h, m));
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`${id}-hour`}>
        {label}
      </label>
      <div className={styles.row} role="group" aria-label={label}>
        <input
          id={`${id}-hour`}
          type="text"
          inputMode="numeric"
          className={styles.part}
          placeholder="HH"
          value={hour}
          onChange={(e) => updateHour(e.target.value)}
          onBlur={onHourBlur}
          aria-label={`${label} hour`}
          maxLength={2}
        />
        <span className={styles.sep} aria-hidden>
          :
        </span>
        <input
          id={`${id}-minute`}
          type="text"
          inputMode="numeric"
          className={styles.part}
          placeholder="MM"
          value={minute}
          onChange={(e) => updateMinute(e.target.value)}
          onBlur={onMinuteBlur}
          aria-label={`${label} minute`}
          maxLength={2}
        />
      </div>
    </div>
  );
}
