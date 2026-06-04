import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { bulkCreateQuestions, fetchQuestionsBulk } from '../api/questions';
import { getSubjects } from '../api/subjects';
import { getTestById, updateTest } from '../api/tests';
import { resolveSubjectId } from '../utils/subject';
import { getErrorMessage } from '../api/client';
import { useTestDraftStore } from '../store/testDraftStore';
import type { DraftQuestion } from '../types';
import { Breadcrumbs } from '../components/Layout/Breadcrumbs';
import { TestSummaryCard } from '../components/test/TestSummaryCard';
import { QuestionSidebar } from '../components/test/QuestionSidebar';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import styles from './QuestionsPage.module.css';

const DIFFICULTIES = [
  { value: '', label: 'Select from Drop-down' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Difficult' },
];

const questionSchema = z.object({
  question: z.string().min(1, 'Question text is required'),
  option1: z.string().min(1, 'Option 1 is required'),
  option2: z.string().min(1, 'Option 2 is required'),
  option3: z.string().min(1, 'Option 3 is required'),
  option4: z.string().min(1, 'Option 4 is required'),
  correct_option: z.enum(['option1', 'option2', 'option3', 'option4']),
  explanation: z.string().optional(),
  difficulty: z.string().optional(),
  media_url: z.string().optional(),
});

type QuestionForm = z.infer<typeof questionSchema>;

function newLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const OPTION_KEYS = ['option1', 'option2', 'option3', 'option4'] as const;

export function QuestionsPage() {
  const { id: testId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const loadedQuestionsForRef = useRef<string | null>(null);

  const draftTestId = useTestDraftStore((s) => s.testId);
  const questions = useTestDraftStore((s) => s.questions);
  const setQuestions = useTestDraftStore((s) => s.setQuestions);
  const addQuestion = useTestDraftStore((s) => s.addQuestion);
  const updateQuestion = useTestDraftStore((s) => s.updateQuestion);
  const setTestId = useTestDraftStore((s) => s.setTestId);

  const { data: test, isLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestById(testId!),
    enabled: !!testId,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  useEffect(() => {
    if (!testId) return;
    setTestId(testId);
    if (draftTestId && draftTestId !== testId) {
      setQuestions([]);
    }
  }, [testId, draftTestId, setTestId, setQuestions]);

  useEffect(() => {
    if (!testId) return;
    if (loadedQuestionsForRef.current === testId) return;
    loadedQuestionsForRef.current = null;
    setQuestionsLoaded(false);
  }, [testId]);

  useEffect(() => {
    if (!test || !testId || test.id !== testId || questionsLoaded) return;

    const currentTest = test;
    const currentTestId = testId;

    async function loadExisting() {
      if (!currentTest.questions?.length) {
        setQuestions([]);
        setQuestionsLoaded(true);
        loadedQuestionsForRef.current = currentTestId;
        return;
      }

      try {
        const fetched = await fetchQuestionsBulk(currentTest.questions);
        const mapped: DraftQuestion[] = fetched.map((q) => ({
          localId: q.id,
          type: 'mcq',
          question: q.question,
          option1: q.option1,
          option2: q.option2,
          option3: q.option3,
          option4: q.option4,
          correct_option: q.correct_option,
          explanation: q.explanation ?? undefined,
          difficulty: q.difficulty ?? 'easy',
          media_url: q.media_url ?? undefined,
          subject: q.subject ?? resolveSubjectId(currentTest, subjects),
          test_id: currentTestId,
        }));
        setQuestions(mapped);
        loadedQuestionsForRef.current = currentTestId;
      } catch {
        /* keep local draft if fetch fails */
      } finally {
        setQuestionsLoaded(true);
      }
    }

    void loadExisting();
  }, [test, testId, questionsLoaded, setQuestions, subjects]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correct_option: 'option1',
      explanation: '',
      difficulty: '',
      media_url: '',
    },
  });

  const correctOption = watch('correct_option');

  const bulkMutation = useMutation({ mutationFn: bulkCreateQuestions });
  const updateTestMutation = useMutation({
    mutationFn: (payload: { questions: string[]; total_questions: number }) =>
      updateTest(testId!, payload),
  });

  const onAddQuestion = (data: QuestionForm) => {
    if (!test) return;
    const subjectId = resolveSubjectId(test, subjects);
    const payload: DraftQuestion = {
      localId: editingId ?? newLocalId(),
      type: 'mcq',
      ...data,
      subject: subjectId,
      difficulty: data.difficulty || 'easy',
      test_id: testId!,
    };
    if (editingId) {
      updateQuestion(editingId, payload);
      setEditingId(null);
    } else {
      addQuestion(payload);
      setActiveIndex(questions.length);
    }
    reset();
  };

  const startEdit = (q: DraftQuestion, index: number) => {
    setEditingId(q.localId);
    setActiveIndex(index);
    reset({
      question: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correct_option: q.correct_option,
      explanation: q.explanation ?? '',
      difficulty: q.difficulty ?? '',
      media_url: q.media_url ?? '',
    });
  };

  const handleSaveContinue = async () => {
    setSaveError('');
    if (!test) return;
    if (questions.length < 1) {
      setSaveError('Add at least one question before continuing.');
      return;
    }
    try {
      const subjectId = resolveSubjectId(test, subjects);
      if (!subjectId) {
        setSaveError(
          'Could not resolve subject for this test. Edit the test and select a subject again.',
        );
        return;
      }

      const newQuestions = questions.filter((q) =>
        q.localId.startsWith('local-'),
      );
      let questionIds = questions
        .filter((q) => !q.localId.startsWith('local-'))
        .map((q) => q.localId);

      if (newQuestions.length > 0) {
        const created = await bulkMutation.mutateAsync(
          newQuestions.map(({ localId: _l, ...q }) => ({
            ...q,
            subject: q.subject || subjectId,
            difficulty: q.difficulty || 'easy',
          })),
        );
        questionIds = [...questionIds, ...created.map((c) => c.id)];
      }

      await updateTestMutation.mutateAsync({
        questions: questionIds,
        total_questions: questionIds.length,
      });

      navigate(`/tests/${testId}/preview`);
    } catch (err) {
      setSaveError(getErrorMessage(err));
    }
  };

  const totalPlanned = test?.total_questions ?? 50;
  const currentNum = questions.length + (editingId ? 0 : 1);

  if (isLoading || !test) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <Breadcrumbs
          items={[
            { label: 'Test Creation', to: '/tests/new' },
            { label: 'Create Test', to: `/tests/${testId}/edit` },
            { label: 'Chapter Wise' },
          ]}
        />
        <Link to={`/tests/${testId}/preview`}>
          <Button>Publish</Button>
        </Link>
      </div>

      <div className={styles.workspace}>
        <QuestionSidebar
          questions={questions}
          activeIndex={activeIndex}
          onSelect={(i) => {
            const q = questions[i];
            if (q) startEdit(q, i);
          }}
          totalPlanned={totalPlanned}
        />

        <div className={styles.main}>
          <TestSummaryCard
            test={test}
            editHref={`/tests/${testId}/edit`}
          />

          <div className={styles.editorCard}>
            <div className={styles.editorHeader}>
              <h2>
                Question {Math.min(currentNum, totalPlanned)}/{totalPlanned}
              </h2>
              <div className={styles.editorActions}>
                <span className={styles.mcqBadge}>+ MCQ</span>
                <span className={styles.csvBadge}>CSV</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onAddQuestion)} className={styles.form}>
              <div className={styles.editorBox}>
                <div className={styles.fakeToolbar}>
                  <span>B</span>
                  <span>I</span>
                  <span>U</span>
                  <span>≡</span>
                  <span>•</span>
                  <span>1.</span>
                </div>
                <textarea
                  className={styles.questionArea}
                  placeholder="Type here"
                  rows={4}
                  {...register('question')}
                />
                {errors.question ? (
                  <span className={styles.err}>{errors.question.message}</span>
                ) : null}
              </div>

              <p className={styles.optionsLabel}>Type the options below</p>
              {OPTION_KEYS.map((key, i) => (
                <label key={key} className={styles.optionRow}>
                  <input
                    type="radio"
                    name="correct_option_ui"
                    checked={correctOption === key}
                    onChange={() => setValue('correct_option', key)}
                  />
                  <input
                    type="text"
                    placeholder="Type Option here"
                    className={styles.optionInput}
                    {...register(key)}
                  />
                  <button
                    type="button"
                    className={styles.optionDelete}
                    onClick={() => setValue(key, '')}
                    aria-label={`Clear option ${i + 1}`}
                  >
                    🗑
                  </button>
                </label>
              ))}
              {errors.correct_option ? (
                <span className={styles.err}>Select correct option</span>
              ) : null}

              <div className={styles.solutionSection}>
                <h3>Add Solution</h3>
                <textarea
                  className={styles.solutionArea}
                  placeholder="Type here"
                  rows={3}
                  {...register('explanation')}
                />
              </div>

              <div className={styles.settings}>
                <h3>Question settings</h3>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Level of Difficulty"
                      options={DIFFICULTIES}
                      {...field}
                    />
                  )}
                />
              </div>

              {saveError ? (
                <div className={styles.saveError}>{saveError}</div>
              ) : null}

              <div className={styles.footer}>
                <Button
                  type="button"
                  variant="outline"
                  className={styles.exitBtn}
                  onClick={() => navigate('/dashboard')}
                >
                  Exit Test Creation
                </Button>
                <div className={styles.footerRight}>
                  {editingId ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button type="submit">
                    {editingId ? 'Update' : 'Next'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    loading={
                      bulkMutation.isPending || updateTestMutation.isPending
                    }
                    onClick={handleSaveContinue}
                  >
                    Save & Continue
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
