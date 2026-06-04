import type { DraftQuestion } from '../../types';
import styles from './QuestionSidebar.module.css';

interface QuestionSidebarProps {
  questions: DraftQuestion[];
  activeIndex: number;
  onSelect: (index: number) => void;
  totalPlanned?: number;
}

export function QuestionSidebar({
  questions,
  activeIndex,
  onSelect,
  totalPlanned = 50,
}: QuestionSidebarProps) {
  const total = Math.max(questions.length, totalPlanned);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span>Question creation</span>
        <span className={styles.collapse}>«</span>
      </div>
      <p className={styles.count}>Total Questions · {questions.length}</p>
      <ul className={styles.list}>
        {Array.from({ length: Math.min(total, 20) }, (_, i) => {
          const done = i < questions.length;
          const active = i === activeIndex;
          return (
            <li key={i}>
              <button
                type="button"
                className={`${styles.item} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
                onClick={() => done && onSelect(i)}
                disabled={!done}
              >
                {done ? <span className={styles.check}>✓</span> : null}
                <span>Question {i + 1}</span>
                {done ? <span className={styles.arrow}>››</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
