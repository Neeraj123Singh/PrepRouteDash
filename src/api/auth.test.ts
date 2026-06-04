import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login } from './auth';

const postMock = vi.fn();

vi.mock('./client', () => ({
  apiClient: { post: (...args: unknown[]) => postMock(...args) },
}));

describe('login API', () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it('returns token and user on success', async () => {
    postMock.mockResolvedValue({
      data: {
        success: true,
        data: { token: 'abc', user: { userId: 'vedant-admin' } },
      },
    });
    const result = await login('vedant-admin', 'vedant123');
    expect(postMock).toHaveBeenCalledWith('/auth/login', {
      userId: 'vedant-admin',
      password: 'vedant123',
    });
    expect(result.token).toBe('abc');
  });

  it('throws when API returns error status', async () => {
    postMock.mockResolvedValue({
      data: { status: 'error', message: 'Access denied. Invalid credentials.' },
    });
    await expect(login('x', 'y')).rejects.toThrow('Access denied');
  });
});
