import { describe, expect, it, vi } from 'vitest';
import { buildEditFormValues } from './hydrateTestForm';
import type { Subject, TestDetail } from '../types';

const subjects: Subject[] = [
  { id: 'sub-1', name: 'General Aptitude Test' },
  { id: 'sub-2', name: 'English' },
];

const test: TestDetail = {
  id: 'test-1',
  name: 'Sample Test',
  subject: 'General Aptitude Test',
  topics: ['Dice'],
  sub_topics: ['Games'],
  type: 'chapterwise',
  difficulty: 'Easy',
  correct_marks: 4,
  wrong_marks: -2,
  unattempt_marks: 0,
  total_time: 45,
  total_marks: 100,
  total_questions: 10,
  status: 'draft',
  created_at: '',
};

describe('buildEditFormValues', () => {
  it('resolves subject, topic, and subtopic ids from API names', async () => {
    const getTopicsBySubject = vi.fn(async (subjectId: string) => {
      if (subjectId === 'sub-1') {
        return [{ id: 'topic-1', name: 'Dice', subject_id: 'sub-1' }];
      }
      return [];
    });
    const getSubTopicsByTopics = vi.fn(async () => [
      { id: 'st-1', name: 'Games', topic_id: 'topic-1' },
    ]);

    const values = await buildEditFormValues(test, subjects, {
      getTopicsBySubject,
      getSubTopicsByTopics,
    });

    expect(values).toMatchObject({
      name: 'Sample Test',
      subject: 'sub-1',
      topic: 'topic-1',
      sub_topic: 'st-1',
      type: 'chapterwise',
      difficulty: 'easy',
      total_time: 45,
      total_marks: 100,
      total_questions: 10,
    });
  });
});
