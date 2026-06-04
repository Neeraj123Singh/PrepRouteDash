import axios from 'axios';

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as {
      message?: string;
      errors?: { msg?: string }[];
    };
    if (data?.errors?.length) {
      return data.errors.map((e) => e.msg).filter(Boolean).join(', ');
    }
    return data?.message || error.message || 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
