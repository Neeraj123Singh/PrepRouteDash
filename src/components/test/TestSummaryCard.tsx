import { Link } from 'react-router-dom';
import { Tag } from '../ui/Tag';
import { testTypeLabel } from '../../constants/testApi';
import type { TestDetail } from '../../types';
import styles from './TestSummaryCard.module.css';

interface TestSummaryCardProps {
  test: TestDetail;
  editHref?: string;
}

export function TestSummaryCard({ test, editHref }: TestSummaryCardProps) {
  const typeLabel = testTypeLabel(test.type);
  const topics = test.topics ?? [];

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <Tag variant="navy">{typeLabel}</Tag>
        {editHref ? (
          <Link to={editHref} className={styles.editBtn} aria-label="Edit test">
            ✎
          </Link>
        ) : null}
      </div>
      <div className={styles.titleRow}>
        <span className={styles.bookIcon}>📖</span>
        <h2>{test.name}</h2>
        <Tag variant="green">{test.difficulty ?? 'Easy'}</Tag>
      </div>
      <div className={styles.meta}>
        <div>
          <span className={styles.metaLabel}>Subject</span>
          <span>{test.subject}</span>
        </div>
        <div>
          <span className={styles.metaLabel}>Topic</span>
          <div className={styles.tags}>
            {topics.length
              ? topics.map((t) => (
                  <Tag key={t} variant="yellow">
                    {t}
                  </Tag>
                ))
              : '—'}
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <span>🕐 {test.total_time ?? 60} Min</span>
        <span>📄 {test.total_questions ?? 0} Q&apos;s</span>
        <span>📊 {test.total_marks ?? 0} Marks</span>
      </div>
    </div>
  );
}
