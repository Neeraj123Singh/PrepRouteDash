import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const fieldId = id || props.name;
    return (
      <div className={styles.field}>
        {label ? (
          <label htmlFor={fieldId} className={styles.label}>
            {label}
            {props.required ? <span className={styles.required}>*</span> : null}
          </label>
        ) : null}
        <input
          ref={ref}
          id={fieldId}
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
          {...props}
        />
        {error ? <span className={styles.error}>{error}</span> : null}
        {hint && !error ? <span className={styles.hint}>{hint}</span> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
