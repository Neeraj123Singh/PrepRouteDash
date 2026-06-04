import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null });
  });

  it('starts unauthenticated', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('setAuth stores token and user', () => {
    useAuthStore.getState().setAuth('jwt-token', { userId: 'vedant-admin' });
    const state = useAuthStore.getState();
    expect(state.token).toBe('jwt-token');
    expect(state.user?.userId).toBe('vedant-admin');
    expect(state.isAuthenticated()).toBe(true);
  });

  it('logout clears session', () => {
    useAuthStore.getState().setAuth('jwt-token', { userId: 'admin' });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });
});
