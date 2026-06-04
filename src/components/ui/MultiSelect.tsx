import styles from './MultiSelect.module.css';

interface MultiSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  error,
  disabled,
  required,
}: MultiSelectProps) {
  const toggle = (id: string) => {
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className={styles.wrap}>
      {label ? (
        <span className={styles.label}>
          {label}
          {required ? <span className={styles.req}>*</span> : null}
        </span>
      ) : null}
      <div className={`${styles.grid} ${disabled ? styles.disabled : ''}`}>
        {options.length === 0 ? (
          <span className={styles.empty}>No options available</span>
        ) : (
          options.map((opt) => (
            <label key={opt.value} className={styles.chip}>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                disabled={disabled}
              />
              <span>{opt.label}</span>
            </label>
          ))
        )}
      </div>
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
}
