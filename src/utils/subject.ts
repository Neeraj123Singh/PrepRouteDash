import type { Subject, TestDetail } from '../types';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export function resolveSubjectId(
  test: Pick<TestDetail, 'subject' | 'subject_id'>,
  subjects: Subject[],
): string {
  if (test.subject_id) return String(test.subject_id);
  if (test.subject && UUID_RE.test(test.subject)) return String(test.subject);
  const subjectName = test.subject?.trim();
  if (subjectName) {
    const refNorm = normalizeName(subjectName);
    const byName = subjects.find((s) => normalizeName(s.name) === refNorm);
    if (byName) return String(byName.id);
  }
  const byId = subjects.find((s) => String(s.id) === String(test.subject));
  return byId ? String(byId.id) : String(test.subject ?? '');
}

export function resolveSubjectName(
  test: Pick<TestDetail, 'subject' | 'subject_id'>,
  subjects: Subject[],
): string {
  if (test.subject && !UUID_RE.test(test.subject)) return test.subject;
  const id = resolveSubjectId(test, subjects);
  return subjects.find((s) => String(s.id) === id)?.name ?? test.subject ?? '—';
}
