export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  data?: T;
  message?: string;
}

export interface User {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export type TestStatus = 'draft' | 'live' | string;

export interface TestListItem {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  status: TestStatus;
  created_at: string;
}

export interface TestDetail extends TestListItem {
  type?: string;
  subject_id?: string;
  sub_topics?: string[];
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: string;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[];
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: string;
}

export interface QuestionFormValues {
  type: 'mcq';
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: 'option1' | 'option2' | 'option3' | 'option4';
  explanation?: string;
  difficulty?: string;
  subject: string;
  topic_id?: string;
  sub_topic_id?: string;
  media_url?: string;
  test_id: string;
}

export interface Question extends QuestionFormValues {
  id: string;
  topic?: string;
  sub_topic?: string;
}

export interface DraftQuestion extends QuestionFormValues {
  localId: string;
}
