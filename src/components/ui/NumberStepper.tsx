import styles from './NumberStepper.module.css';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
}

export function NumberStepper({
  label,
  value,
  onChange,
  prefix = '',
}: NumberStepperProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.step}
          onClick={() => onChange(value - 1)}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className={styles.value}>
          {prefix}
          {value}
        </span>
        <button
          type="button"
          className={styles.step}
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
