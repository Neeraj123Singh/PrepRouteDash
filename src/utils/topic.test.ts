import { describe, expect, it } from 'vitest';
import { resolveSubTopicId, resolveTopicId } from './topic';

describe('resolveTopicId', () => {
  const topics = [
    { id: 't-1', name: 'Dice', subject_id: 's-1' },
    { id: 't-2', name: 'Algebra', subject_id: 's-1' },
  ];

  it('matches by name from API response', () => {
    expect(resolveTopicId('Dice', topics)).toBe('t-1');
  });

  it('matches by id', () => {
    expect(resolveTopicId('t-2', topics)).toBe('t-2');
  });
});

describe('resolveSubTopicId', () => {
  const subTopics = [
    { id: 'st-1', name: 'Basics', topic_id: 't-1' },
  ];

  it('matches by name', () => {
    expect(resolveSubTopicId('Basics', subTopics)).toBe('st-1');
  });
});
