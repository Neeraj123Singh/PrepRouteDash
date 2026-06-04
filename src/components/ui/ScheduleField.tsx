import type { ReactNode } from 'react';
import styles from './ScheduleField.module.css';

interface ScheduleFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export function ScheduleField({ id, label, children }: ScheduleFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
