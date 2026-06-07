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
  const byId = topics.find((t) => String(t.id) === ref);
  if (byId) return String(byId.id);
  const refNorm = normalizeName(ref);
  const byName = topics.find((t) => normalizeName(t.name) === refNorm);
  if (byName) return String(byName.id);
  if (UUID_RE.test(ref)) return ref;
  return '';
}

export function resolveSubTopicId(
  subTopicRef: string | undefined,
  subTopics: SubTopic[],
): string {
  if (!subTopicRef) return '';
  const ref = subTopicRef.trim();
  const byId = subTopics.find((st) => String(st.id) === ref);
  if (byId) return String(byId.id);
  const refNorm = normalizeName(ref);
  const byName = subTopics.find((st) => normalizeName(st.name) === refNorm);
  if (byName) return String(byName.id);
  if (UUID_RE.test(ref)) return ref;
  return '';
}
