import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSubjects,
  getSubTopicsByTopics,
  getSubTopicsByTopic,
  getTopicsBySubject,
} from './subjects';

const getMock = vi.fn();
const postMock = vi.fn();

vi.mock('./client', () => ({
  apiClient: {
    get: (...args: unknown[]) => getMock(...args),
    post: (...args: unknown[]) => postMock(...args),
  },
}));

describe('subjects API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSubjects calls GET /subjects', async () => {
    getMock.mockResolvedValue({ data: { data: [{ id: 's1', name: 'Math' }] } });
    const subjects = await getSubjects();
    expect(getMock).toHaveBeenCalledWith('/subjects');
    expect(subjects[0].name).toBe('Math');
  });

  it('getTopicsBySubject calls correct path', async () => {
    getMock.mockResolvedValue({ data: { data: [] } });
    await getTopicsBySubject('sub-1');
    expect(getMock).toHaveBeenCalledWith('/topics/subject/sub-1');
  });

  it('getSubTopicsByTopic calls correct path', async () => {
    getMock.mockResolvedValue({ data: { data: [] } });
    await getSubTopicsByTopic('topic-1');
    expect(getMock).toHaveBeenCalledWith('/sub-topics/topic/topic-1');
  });

  it('getSubTopicsByTopics posts topicIds', async () => {
    postMock.mockResolvedValue({ data: { data: [] } });
    await getSubTopicsByTopics(['t1', 't2']);
    expect(postMock).toHaveBeenCalledWith('/sub-topics/multi-topics', {
      topicIds: ['t1', 't2'],
    });
  });
});
