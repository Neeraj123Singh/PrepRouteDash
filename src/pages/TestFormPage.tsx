import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { buildTestPayload } from '../api/testPayload';
import { createTest, getTestById, updateTest } from '../api/tests';
import {
  DIFFICULTY_OPTIONS,
  normalizeTestType,
  TEST_TYPE_TABS,
} from '../constants/testApi';
import {
  getSubjects,
  getSubTopicsByTopics,
  getTopicsBySubject,
} from '../api/subjects';
import { getErrorMessage } from '../api/client';
import { useTestDraftStore } from '../store/testDraftStore';
import { buildEditFormValues } from '../utils/hydrateTestForm';
import { Breadcrumbs } from '../components/Layout/Breadcrumbs';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { RadioGroup } from '../components/ui/RadioGroup';
import { NumberStepper } from '../components/ui/NumberStepper';
import styles from './TestFormPage.module.css';

const TEST_TABS = [...TEST_TYPE_TABS];

const schema = z.object({
  name: z.string().min(1, 'Test name is required'),
  subject: z.string().min(1, 'Subject is required'),
  type: z.string().min(1, 'Test type is required'),
  topic: z.string().min(1, 'Topic is required'),
  sub_topic: z.string().optional(),
  difficulty: z.string().min(1, 'Difficulty is required'),
  correct_marks: z.number(),
  wrong_marks: z.number(),
  unattempt_marks: z.number(),
  total_time: z.number().min(1, 'Duration is required'),
  total_marks: z.number().min(1, 'Total marks is required'),
  total_questions: z.number().min(1, 'Number of questions is required'),
});

type TestFormValues = z.infer<typeof schema>;

export function TestFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const setTestId = useTestDraftStore((s) => s.setTestId);
  const [activeTab, setActiveTab] = useState<typeof TEST_TYPE_TABS[number]['id']>('chapterwise');
  const [apiError, setApiError] = useState('');
  const hydratedTestIdRef = useRef<string | null>(null);

  const { data: existingTest, isLoading: loadingTest } = useQuery({
    queryKey: ['test', id],
    queryFn: () => getTestById(id!),
    enabled: isEdit,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      subject: '',
      type: 'chapterwise',
      topic: '',
      sub_topic: '',
      difficulty: 'easy',
      correct_marks: 5,
      wrong_marks: -1,
      unattempt_marks: 0,
      total_time: 60,
      total_marks: 250,
      total_questions: 50,
    },
  });

  const subjectId = watch('subject');
  const topicId = watch('topic');
  const testType = watch('type');

  useEffect(() => {
    setActiveTab(normalizeTestType(testType));
  }, [testType]);

  const { data: topics = [], isLoading: loadingTopics } = useQuery({
    queryKey: ['topics', subjectId],
    queryFn: () => getTopicsBySubject(subjectId),
    enabled: !!subjectId,
  });

  const { data: subTopics = [], isLoading: loadingSubTopics } = useQuery({
    queryKey: ['subTopics', topicId],
    queryFn: () => getSubTopicsByTopics(topicId ? [topicId] : []),
    enabled: !!topicId,
  });

  useEffect(() => {
    hydratedTestIdRef.current = null;
  }, [id]);

  useEffect(() => {
    if (!isEdit || !id || !existingTest || !subjects.length) return;
    if (existingTest.id !== id) return;
    if (hydratedTestIdRef.current === id) return;

    let cancelled = false;

    void (async () => {
      const values = await buildEditFormValues(existingTest, subjects, {
        getTopicsBySubject,
        getSubTopicsByTopics,
      });
      if (cancelled) return;

      setActiveTab(normalizeTestType(values.type));
      reset(values);
      hydratedTestIdRef.current = id;
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, id, existingTest, subjects, reset]);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: String(s.id), label: s.name })),
    [subjects],
  );

  const topicOptions = useMemo(
    () => topics.map((t) => ({ value: String(t.id), label: t.name })),
    [topics],
  );

  const subTopicOptions = useMemo(
    () => subTopics.map((st) => ({ value: String(st.id), label: st.name })),
    [subTopics],
  );

  const saveMutation = useMutation({
    mutationFn: async ({
      values,
      asDraft,
    }: {
      values: TestFormValues;
      asDraft: boolean;
    }) => {
      const payload = buildTestPayload(values, { asDraft });
      if (isEdit && id) return updateTest(id, payload);
      return createTest(payload);
    },
  });

  const onSave = async (values: TestFormValues, asDraft: boolean) => {
    setApiError('');
    try {
      const test = await saveMutation.mutateAsync({ values, asDraft });
      if (test?.id) {
        setTestId(test.id);
        navigate(`/tests/${test.id}/questions`);
      }
    } catch (err) {
      setApiError(getErrorMessage(err));
    }
  };

  const tabLabel =
    TEST_TABS.find((t) => t.id === activeTab)?.label ?? 'Chapter Wise';

  if (isEdit && loadingTest) {
    return <div className={styles.loading}>Loading test...</div>;
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Test Creation', to: '/tests/new' },
          { label: 'Create Test', to: '/tests/new' },
          { label: tabLabel },
        ]}
      />

      <div className={styles.card}>
        <Tabs
          tabs={TEST_TABS}
          activeId={activeTab}
          onChange={(tabId) => {
            const type = normalizeTestType(tabId);
            setActiveTab(type);
            setValue('type', type);
          }}
        />

        <form className={styles.form}>
          <div className={styles.grid}>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  label="Subject"
                  required
                  placeholder="Choose from Drop-down"
                  options={subjectOptions}
                  error={errors.subject?.message}
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    if (e.target.value !== field.value) {
                      setValue('topic', '');
                      setValue('sub_topic', '');
                    }
                    field.onChange(e);
                  }}
                />
              )}
            />
            <Input
              label="Name of Test"
              required
              placeholder="Enter name of Test"
              error={errors.name?.message}
              {...register('name')}
            />
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <Select
                  label="Topic"
                  required
                  placeholder="Choose from Drop-down"
                  options={topicOptions}
                  disabled={!subjectId || loadingTopics}
                  error={errors.topic?.message}
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    if (e.target.value !== field.value) {
                      setValue('sub_topic', '');
                    }
                    field.onChange(e);
                  }}
                />
              )}
            />
            <Controller
              name="sub_topic"
              control={control}
              render={({ field }) => (
                <Select
                  label="Sub Topic"
                  placeholder="Choose from Drop-down"
                  options={subTopicOptions}
                  disabled={!topicId || loadingSubTopics}
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
            <Input
              label="Duration (Minutes)"
              type="number"
              required
              placeholder="Enter the time"
              error={errors.total_time?.message}
              {...register('total_time', { valueAsNumber: true })}
            />
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  label="Test Difficulty Level"
                  name="difficulty"
                  options={DIFFICULTY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.difficulty?.message}
                />
              )}
            />
          </div>

          <div className={styles.markingSection}>
            <h3>Marking Scheme:</h3>
            <div className={styles.steppers}>
              <Controller
                name="wrong_marks"
                control={control}
                render={({ field }) => (
                  <NumberStepper
                    label="Wrong Answer"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="unattempt_marks"
                control={control}
                render={({ field }) => (
                  <NumberStepper
                    label="Unattempted"
                    value={field.value}
                    onChange={field.onChange}
                    prefix="+"
                  />
                )}
              />
              <Controller
                name="correct_marks"
                control={control}
                render={({ field }) => (
                  <NumberStepper
                    label="Correct Answer"
                    value={field.value}
                    onChange={field.onChange}
                    prefix="+"
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <Input
              label="No of Questions"
              type="number"
              required
              placeholder="Ex: 50"
              error={errors.total_questions?.message}
              {...register('total_questions', { valueAsNumber: true })}
            />
            <Input
              label="Total Marks"
              type="number"
              required
              placeholder="Ex:250 Marks"
              error={errors.total_marks?.message}
              {...register('total_marks', { valueAsNumber: true })}
            />
          </div>

          {apiError ? <div className={styles.apiError}>{apiError}</div> : null}

          <div className={styles.actions}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              loading={isSubmitting}
              onClick={handleSubmit((v) => onSave(v, false))}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
