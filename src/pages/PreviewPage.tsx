import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchQuestionsBulk } from '../api/questions';
import { getTestById, publishTest } from '../api/tests';
import { getErrorMessage } from '../api/client';
import { useTestDraftStore } from '../store/testDraftStore';
import { Breadcrumbs } from '../components/Layout/Breadcrumbs';
import { TestSummaryCard } from '../components/test/TestSummaryCard';
import { Button } from '../components/ui/Button';
import { ScheduleField } from '../components/ui/ScheduleField';
import { TimeField } from '../components/ui/TimeField';
import styles from './PreviewPage.module.css';

const LIVE_OPTIONS = [
  'Always Available',
  '1 Week',
  '2 Weeks',
  '3 Weeks',
  '1 Month',
  'Custom Duration',
];

export function PreviewPage() {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearDraft = useTestDraftStore((s) => s.clearDraft);
  const [published, setPublished] = useState(false);
  const [publishTab, setPublishTab] = useState<'now' | 'schedule'>('now');
  const [liveUntil, setLiveUntil] = useState('Custom Duration');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const { data: test, isLoading: loadingTest } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestById(testId!),
    enabled: !!testId,
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questions', testId, test?.questions],
    queryFn: () => fetchQuestionsBulk(test!.questions!),
    enabled: !!test?.questions?.length,
  });

  const publishMutation = useMutation({
    mutationFn: () => publishTest(testId!),
    onSuccess: () => {
      setPublished(true);
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      setTimeout(() => navigate('/dashboard'), 2500);
    },
  });

  const handleConfirm = async () => {
    try {
      await publishMutation.mutateAsync();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loadingTest) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!test) {
    return <div className={styles.loading}>Test not found.</div>;
  }

  const questionCount = questions.length || test.total_questions || 0;

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Test Creation', to: '/tests/new' },
          { label: 'Test creation' },
        ]}
      />

      {published ? (
        <div className={styles.success}>
          <h2>Test published successfully!</h2>
          <p>Redirecting to dashboard...</p>
        </div>
      ) : null}

      <div className={styles.statusRow}>
        <span className={styles.statusLabel}>Test created</span>
        <span className={styles.doneBadge}>
          ✓ All {questionCount} Questions done
        </span>
      </div>

      <TestSummaryCard test={test} editHref={`/tests/${testId}/edit`} />

      <div className={styles.publishCard}>
        <div className={styles.publishTabs}>
          <button
            type="button"
            className={publishTab === 'now' ? styles.tabActive : styles.tab}
            onClick={() => setPublishTab('now')}
          >
            Publish Now
          </button>
          <button
            type="button"
            className={
              publishTab === 'schedule' ? styles.tabActive : styles.tab
            }
            onClick={() => setPublishTab('schedule')}
          >
            Schedule Publish
          </button>
        </div>

        {publishTab === 'schedule' ? (
          <div className={styles.scheduleRow}>
            <ScheduleField id="schedule-date" label="Select Date">
              <input
                id="schedule-date"
                type="date"
                className={styles.dateInput}
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </ScheduleField>
            <TimeField
              id="schedule-time"
              label="Time (24h)"
              value={scheduleTime}
              onChange={setScheduleTime}
            />
          </div>
        ) : null}

        <h3 className={styles.liveTitle}>Live Until</h3>
        <p className={styles.liveHint}>
          Choose how long this test should remain available on the platform.
        </p>

        <div className={styles.radioGrid}>
          {LIVE_OPTIONS.map((opt) => (
            <label key={opt} className={styles.radioItem}>
              <input
                type="radio"
                name="liveUntil"
                checked={liveUntil === opt}
                onChange={() => setLiveUntil(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {liveUntil === 'Custom Duration' ? (
          <div className={styles.scheduleRow}>
            <ScheduleField id="end-date" label="Select End Date">
              <input
                id="end-date"
                type="date"
                className={styles.dateInput}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </ScheduleField>
            <TimeField
              id="end-time"
              label="End time (24h)"
              value={endTime}
              onChange={setEndTime}
            />
          </div>
        ) : null}

        <div className={styles.previewLinks}>
          <Link to={`/tests/${testId}/questions`}>Edit questions</Link>
          <span>·</span>
          <Link to={`/tests/${testId}/edit`}>Edit test details</Link>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button
            loading={publishMutation.isPending}
            onClick={handleConfirm}
            disabled={questionCount < 1}
          >
            Confirm
          </Button>
        </div>
        {questionCount < 1 ? (
          <p className={styles.hint}>
            Add at least one question before publishing.
          </p>
        ) : null}
      </div>
    </div>
  );
}
