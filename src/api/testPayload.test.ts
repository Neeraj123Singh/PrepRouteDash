import { describe, expect, it } from 'vitest';
import { buildTestPayload } from './testPayload';

describe('buildTestPayload', () => {
  const base = {
    name: 'My Test',
    subject: '54534fab-e347-4ec5-9de1-dca8dadd2b7f',
    type: 'practice',
    topic: 'topic-1',
    sub_topic: '',
    difficulty: 'easy',
    correct_marks: 5,
    wrong_marks: -1,
    unattempt_marks: 0,
    total_time: 60,
    total_marks: 100,
    total_questions: 10,
  };

  it('maps legacy practice type to chapterwise and sends subject UUID string', () => {
    const payload = buildTestPayload(base);
    expect(payload.type).toBe('chapterwise');
    expect(payload.subject).toBe(base.subject);
    expect(payload.topics).toEqual(['topic-1']);
  });

  it('maps assessment tab id to mock', () => {
    const payload = buildTestPayload({ ...base, type: 'assessment' });
    expect(payload.type).toBe('mock');
  });

  it('includes draft status when requested', () => {
    const payload = buildTestPayload(base, { asDraft: true });
    expect(payload.status).toBe('draft');
  });
});
