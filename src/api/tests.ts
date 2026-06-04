import { apiClient } from './client';
import type {
  ApiResponse,
  CreateTestPayload,
  TestDetail,
  TestListItem,
} from '../types';

export async function getTests() {
  const { data } = await apiClient.get<ApiResponse<TestListItem[]>>('/tests');
  return data.data ?? [];
}

export async function getTestById(id: string) {
  const { data } = await apiClient.get<ApiResponse<TestDetail>>(`/tests/${id}`);
  return data.data;
}

export async function createTest(payload: CreateTestPayload) {
  const { data } = await apiClient.post<ApiResponse<TestDetail>>(
    '/tests',
    payload,
  );
  return data.data;
}

export async function updateTest(
  id: string,
  payload: Partial<CreateTestPayload> & {
    questions?: string[];
    status?: string;
    total_questions?: number;
    total_marks?: number;
  },
) {
  const { data } = await apiClient.put<ApiResponse<TestDetail>>(
    `/tests/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteTest(id: string) {
  await apiClient.delete(`/tests/${id}`);
}

export async function publishTest(id: string) {
  return updateTest(id, { status: 'live' });
}
