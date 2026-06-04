/** Staging API test `type` values (see POST /tests). */
export const TEST_TYPE_TABS = [
  { id: 'chapterwise', label: 'Chapter Wise' },
  { id: 'pyq', label: 'PYQ' },
  { id: 'mock', label: 'Mock Test' },
] as const;

export type ApiTestType = (typeof TEST_TYPE_TABS)[number]['id'];

export type ApiDifficulty = 'easy' | 'medium' | 'hard';

const TYPE_LABELS: Record<ApiTestType, string> = {
  chapterwise: 'Chapter Wise',
  pyq: 'PYQ',
  mock: 'Mock Test',
};

/** Map legacy UI values to API enums. */
export function normalizeTestType(type?: string): ApiTestType {
  if (type === 'chapterwise' || type === 'pyq' || type === 'mock') return type;
  if (type === 'practice') return 'chapterwise';
  if (type === 'assessment') return 'mock';
  if (type === 'mock_test') return 'mock';
  return 'chapterwise';
}

export function testTypeLabel(type?: string): string {
  return TYPE_LABELS[normalizeTestType(type)] ?? 'Chapter Wise';
}

export function normalizeDifficulty(difficulty?: string): ApiDifficulty {
  const value = (difficulty ?? 'easy').trim().toLowerCase();
  if (value === 'medium') return 'medium';
  if (value === 'hard' || value === 'difficult') return 'hard';
  return 'easy';
}

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Difficult' },
] as const;
