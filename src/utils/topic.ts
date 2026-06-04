import type { SubTopic, Topic } from '../types';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export function resolveTopicId(
  topicRef: string | undefined,
  topics: Topic[],
): string {
  if (!topicRef) return '';
  const ref = topicRef.trim();
  if (UUID_RE.test(ref)) {
    const byId = topics.find((t) => String(t.id) === ref);
    return byId ? String(byId.id) : ref;
  }
  const refNorm = normalizeName(ref);
  const byName = topics.find((t) => normalizeName(t.name) === refNorm);
  return byName ? String(byName.id) : '';
}

export function resolveSubTopicId(
  subTopicRef: string | undefined,
  subTopics: SubTopic[],
): string {
  if (!subTopicRef) return '';
  const ref = subTopicRef.trim();
  if (UUID_RE.test(ref)) {
    const byId = subTopics.find((st) => String(st.id) === ref);
    return byId ? String(byId.id) : ref;
  }
  const refNorm = normalizeName(ref);
  const byName = subTopics.find((st) => normalizeName(st.name) === refNorm);
  return byName ? String(byName.id) : '';
}
