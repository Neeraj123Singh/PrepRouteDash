import { describe, expect, it } from 'vitest';
import { normalizeTestType, testTypeLabel } from './testApi';

describe('testApi constants', () => {
  it('normalizes legacy types', () => {
    expect(normalizeTestType('practice')).toBe('chapterwise');
    expect(normalizeTestType('assessment')).toBe('mock');
    expect(normalizeTestType('pyq')).toBe('pyq');
  });

  it('labels API types for UI', () => {
    expect(testTypeLabel('chapterwise')).toBe('Chapter Wise');
    expect(testTypeLabel('mock')).toBe('Mock Test');
  });
});
