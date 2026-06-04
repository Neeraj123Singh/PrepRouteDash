import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createTest,
  deleteTest,
  getTests,
  publishTest,
  updateTest,
} from './tests';

const getMock = vi.fn();
const postMock = vi.fn();
const putMock = vi.fn();
const deleteMock = vi.fn();

vi.mock('./client', () => ({
  apiClient: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
    put: (...args: unknown[]) => putMock(...args),
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}));

describe('tests API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getTests fetches /tests', async () => {
    getMock.mockResolvedValue({ data: { data: [{ id: '1', name: 'T1' }] } });
    const tests = await getTests();
    expect(getMock).toHaveBeenCalledWith('/tests');
    expect(tests).toHaveLength(1);
  });

  it('createTest posts payload to /tests', async () => {
    postMock.mockResolvedValue({ data: { data: { id: 'new-id' } } });
    const payload = {
      name: 'Test',
      type: 'practice',
      subject: 'sub-1',
      topics: ['t1'],
      sub_topics: [],
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      difficulty: 'medium',
      total_time: 60,
      total_marks: 100,
      total_questions: 10,
    };
    const result = await createTest(payload);
    expect(postMock).toHaveBeenCalledWith('/tests', payload);
    expect(result?.id).toBe('new-id');
  });

  it('publishTest sets status live', async () => {
    putMock.mockResolvedValue({ data: { data: { id: '1', status: 'live' } } });
    await publishTest('test-1');
    expect(putMock).toHaveBeenCalledWith('/tests/test-1', { status: 'live' });
  });

  it('updateTest puts to /tests/:id', async () => {
    putMock.mockResolvedValue({ data: { data: { id: '1' } } });
    await updateTest('1', { name: 'Updated' });
    expect(putMock).toHaveBeenCalledWith('/tests/1', { name: 'Updated' });
  });

  it('deleteTest calls DELETE /tests/:id', async () => {
    deleteMock.mockResolvedValue({});
    await deleteTest('1');
    expect(deleteMock).toHaveBeenCalledWith('/tests/1');
  });
});
