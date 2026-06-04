import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './LoginPage';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(authApi.login).mockReset();
  });

  it('renders login form fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/user id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText('User ID is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows API error on failed login', async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new Error('Access denied. Invalid credentials.'),
    );
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByLabelText(/user id/i), 'vedant-admin');
    await user.type(screen.getByLabelText(/password/i), 'vedant123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(
        screen.getByText('Access denied. Invalid credentials.'),
      ).toBeInTheDocument();
    });
  });
});
