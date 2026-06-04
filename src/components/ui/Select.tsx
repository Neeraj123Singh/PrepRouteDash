import { forwardRef, type SelectHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, id, className = '', ...props },
    ref,
  ) => {
    const fieldId = id || props.name;
    return (
      <div className={styles.field}>
        {label ? (
          <label htmlFor={fieldId} className={styles.label}>
            {label}
            {props.required ? <span className={styles.required}>*</span> : null}
          </label>
        ) : null}
        <select
          ref={ref}
          id={fieldId}
          className={`${styles.select} ${error ? styles.inputError : ''} ${className}`}
          {...props}
        >
          {placeholder ? (
            <option value="">{placeholder}</option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? <span className={styles.error}>{error}</span> : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
