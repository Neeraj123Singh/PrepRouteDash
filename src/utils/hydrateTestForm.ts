import type { TestFormPayloadInput } from '../api/testPayload';
import {
  normalizeDifficulty,
  normalizeTestType,
} from '../constants/testApi';
import type { SubTopic, Subject, TestDetail, Topic } from '../types';
import { resolveSubjectId } from './subject';
import { resolveSubTopicId, resolveTopicId } from './topic';

export interface HydrateTestFormDeps {
  getTopicsBySubject: (subjectId: string) => Promise<Topic[]>;
  getSubTopicsByTopics: (topicIds: string[]) => Promise<SubTopic[]>;
}

export async function buildEditFormValues(
  test: TestDetail,
  subjects: Subject[],
  deps: HydrateTestFormDeps,
): Promise<TestFormPayloadInput> {
  let subjectId = resolveSubjectId(test, subjects);
  let topicId = '';
  let subTopicId = '';

  const loadTopicForSubject = async (sid: string) => {
    const topics = await deps.getTopicsBySubject(sid);
    const tid = resolveTopicId(test.topics?.[0], topics);
    return { topics, topicId: tid };
  };

  if (test.topics?.[0]) {
    if (subjectId) {
      const primary = await loadTopicForSubject(subjectId);
      topicId = primary.topicId;
    }

    if (!topicId) {
      for (const subject of subjects) {
        const sid = String(subject.id);
        if (sid === subjectId) continue;
        const attempt = await loadTopicForSubject(sid);
        if (attempt.topicId) {
          subjectId = sid;
          topicId = attempt.topicId;
          break;
        }
      }
    }

    if (topicId) {
      const subTopics = await deps.getSubTopicsByTopics([topicId]);
      subTopicId = resolveSubTopicId(test.sub_topics?.[0], subTopics);
    }
  }

  return {
    name: test.name ?? '',
    subject: subjectId,
    type: normalizeTestType(test.type),
    topic: topicId,
    sub_topic: subTopicId,
    difficulty: normalizeDifficulty(test.difficulty),
    correct_marks: test.correct_marks ?? 5,
    wrong_marks: test.wrong_marks ?? -1,
    unattempt_marks: test.unattempt_marks ?? 0,
    total_time: test.total_time ?? 60,
    total_marks: test.total_marks ?? 250,
    total_questions: test.total_questions ?? 50,
  };
}
