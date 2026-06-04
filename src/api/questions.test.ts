import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bulkCreateQuestions, fetchQuestionsBulk } from './questions';

const postMock = vi.fn();

vi.mock('./client', () => ({
  apiClient: { post: (...args: unknown[]) => postMock(...args) },
}));

describe('questions API', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('bulkCreateQuestions posts to /questions/bulk', async () => {
    postMock.mockResolvedValue({
      data: { data: [{ id: 'q1' }] },
    });
    const questions = [
      {
        type: 'mcq' as const,
        question: 'Q?',
        option1: 'a',
        option2: 'b',
        option3: 'c',
        option4: 'd',
        correct_option: 'option1' as const,
        subject: 'sub-1',
        test_id: 't1',
      },
    ];
    const result = await bulkCreateQuestions(questions);
    expect(postMock).toHaveBeenCalledWith('/questions/bulk', { questions });
    expect(result[0].id).toBe('q1');
  });

  it('fetchQuestionsBulk posts question_ids', async () => {
    postMock.mockResolvedValue({ data: { data: [] } });
    await fetchQuestionsBulk(['id1', 'id2']);
    expect(postMock).toHaveBeenCalledWith('/questions/fetchBulk', {
      question_ids: ['id1', 'id2'],
    });
  });
});
