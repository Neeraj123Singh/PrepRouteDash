import { apiClient } from './client';
import type { ApiResponse, Question, QuestionFormValues } from '../types';

export async function bulkCreateQuestions(questions: QuestionFormValues[]) {
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/bulk',
    { questions },
  );
  return data.data ?? [];
}

export async function fetchQuestionsBulk(questionIds: string[]) {
  const { data } = await apiClient.post<ApiResponse<Question[]>>(
    '/questions/fetchBulk',
    { question_ids: questionIds },
  );
  return data.data ?? [];
}
