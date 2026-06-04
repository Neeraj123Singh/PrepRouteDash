import type { ReactNode } from 'react';
import styles from './Tag.module.css';

type TagVariant = 'yellow' | 'navy' | 'green' | 'default';

interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
}

export function Tag({ children, variant = 'default' }: TagProps) {
  return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>;
}
