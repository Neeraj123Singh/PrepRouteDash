import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('returns validation errors joined from axios response', () => {
    const error = new axios.AxiosError(
      'Bad Request',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        data: {
          errors: [{ msg: 'userId is required' }, { msg: 'password is required' }],
        },
        statusText: 'Bad Request',
        headers: {},
        config: {} as never,
      },
    );
    expect(getErrorMessage(error)).toBe('userId is required, password is required');
  });

  it('returns API message from axios response', () => {
    const error = new axios.AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        data: { message: 'Access denied. Invalid credentials.' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as never,
      },
    );
    expect(getErrorMessage(error)).toBe('Access denied. Invalid credentials.');
  });

  it('returns Error message for standard errors', () => {
    expect(getErrorMessage(new Error('Network failed'))).toBe('Network failed');
  });

  it('returns fallback for unknown errors', () => {
    expect(getErrorMessage('unknown')).toBe('Something went wrong');
  });
});
