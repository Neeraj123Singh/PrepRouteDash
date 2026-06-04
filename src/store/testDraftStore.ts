import { create } from 'zustand';
import type { DraftQuestion } from '../types';

interface TestDraftState {
  testId: string | null;
  questions: DraftQuestion[];
  setTestId: (id: string) => void;
  setQuestions: (questions: DraftQuestion[]) => void;
  addQuestion: (question: DraftQuestion) => void;
  updateQuestion: (localId: string, question: DraftQuestion) => void;
  removeQuestion: (localId: string) => void;
  clearDraft: () => void;
}

export const useTestDraftStore = create<TestDraftState>((set) => ({
  testId: null,
  questions: [],
  setTestId: (id) => set({ testId: id }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  updateQuestion: (localId, question) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.localId === localId ? question : q,
      ),
    })),
  removeQuestion: (localId) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.localId !== localId),
    })),
  clearDraft: () => set({ testId: null, questions: [] }),
}));
