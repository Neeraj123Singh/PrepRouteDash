import { apiClient } from './client';
import type { ApiResponse, LoginResponse } from '../types';

export async function login(userId: string, password: string) {
  const { data } = await apiClient.post<
    ApiResponse<LoginResponse> & { status?: string; message?: string }
  >('/auth/login', { userId, password });

  if (data.status === 'error' || !data.data?.token) {
    throw new Error(data.message || 'Invalid credentials. Please try again.');
  }
  return data.data;
}
