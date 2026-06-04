import { normalizeTestType } from '../constants/testApi';
import type { CreateTestPayload } from '../types';

export interface TestFormPayloadInput {
  name: string;
  subject: string;
  type: string;
  topic: string;
  sub_topic?: string;
  difficulty: string;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
}

export function buildTestPayload(
  values: TestFormPayloadInput,
  options?: { asDraft?: boolean },
): CreateTestPayload {
  const { topic, sub_topic, subject, type, ...rest } = values;

  return {
    ...rest,
    subject: String(subject),
    type: normalizeTestType(type),
    topics: topic ? [String(topic)] : [],
    sub_topics: sub_topic ? [String(sub_topic)] : [],
    ...(options?.asDraft ? { status: 'draft' } : {}),
  };
}
