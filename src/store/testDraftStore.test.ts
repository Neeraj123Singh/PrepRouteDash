import { beforeEach, describe, expect, it } from 'vitest';
import { useTestDraftStore } from './testDraftStore';
import type { DraftQuestion } from '../types';

const sampleQuestion = (localId: string): DraftQuestion => ({
  localId,
  type: 'mcq',
  question: 'What is 2+2?',
  option1: '3',
  option2: '4',
  option3: '5',
  option4: '6',
  correct_option: 'option2',
  subject: 'sub-1',
  test_id: 'test-1',
});

describe('testDraftStore', () => {
  beforeEach(() => {
    useTestDraftStore.getState().clearDraft();
  });

  it('adds and removes questions', () => {
    useTestDraftStore.getState().addQuestion(sampleQuestion('q1'));
    expect(useTestDraftStore.getState().questions).toHaveLength(1);
    useTestDraftStore.getState().removeQuestion('q1');
    expect(useTestDraftStore.getState().questions).toHaveLength(0);
  });

  it('updates a question by localId', () => {
    useTestDraftStore.getState().addQuestion(sampleQuestion('q1'));
    useTestDraftStore
      .getState()
      .updateQuestion('q1', { ...sampleQuestion('q1'), question: 'Updated?' });
    expect(useTestDraftStore.getState().questions[0].question).toBe('Updated?');
  });

  it('clearDraft resets testId and questions', () => {
    useTestDraftStore.getState().setTestId('test-99');
    useTestDraftStore.getState().addQuestion(sampleQuestion('q1'));
    useTestDraftStore.getState().clearDraft();
    const state = useTestDraftStore.getState();
    expect(state.testId).toBeNull();
    expect(state.questions).toEqual([]);
  });
});
