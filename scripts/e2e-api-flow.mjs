/**
 * Verifies full staging flow: login → create test → bulk questions → publish.
 * Run: node scripts/e2e-api-flow.mjs
 */
const BASE = 'https://admin-moderator-backend-staging.up.railway.app/api';

async function json(res) {
  return res.json();
}

async function main() {
  const login = await json(
    await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'vedant-admin', password: 'vedant123' }),
    }),
  );
  const token = login.data?.token;
  if (!token) throw new Error('Login failed: ' + JSON.stringify(login));
  console.log('✓ login');

  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const subs = (await json(await fetch(`${BASE}/subjects`, { headers: h }))).data;

  let sub, topic;
  for (const s of subs) {
    const topics = (await json(await fetch(`${BASE}/topics/subject/${s.id}`, { headers: h }))).data;
    if (topics?.length) {
      sub = s;
      topic = topics[0];
      break;
    }
  }
  if (!sub || !topic) throw new Error('No subject with topics found');

  const form = {
    name: `E2E Test ${Date.now()}`,
    subject: String(sub.id),
    type: 'chapterwise',
    topic: String(topic.id),
    sub_topic: '',
    difficulty: 'easy',
    correct_marks: 5,
    wrong_marks: -1,
    unattempt_marks: 0,
    total_time: 60,
    total_marks: 100,
    total_questions: 2,
  };

  const payload = {
    ...form,
    topics: [form.topic],
    sub_topics: [],
  };
  delete payload.topic;
  delete payload.sub_topic;

  const created = await json(
    await fetch(`${BASE}/tests`, { method: 'POST', headers: h, body: JSON.stringify(payload) }),
  );
  if (!created.data?.id) throw new Error('Create test: ' + JSON.stringify(created));
  const testId = created.data.id;
  console.log('✓ create test', testId);

  const bulk = await json(
    await fetch(`${BASE}/questions/bulk`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify({
        questions: [
          {
            type: 'mcq',
            question: 'E2E Q1?',
            option1: 'a',
            option2: 'b',
            option3: 'c',
            option4: 'd',
            correct_option: 'option1',
            subject: String(sub.id),
            difficulty: 'easy',
            test_id: testId,
          },
        ],
      }),
    }),
  );
  if (!bulk.data?.length) throw new Error('Bulk questions: ' + JSON.stringify(bulk));
  const qIds = bulk.data.map((q) => q.id);
  console.log('✓ bulk questions', qIds.length);

  const linked = await json(
    await fetch(`${BASE}/tests/${testId}`, {
      method: 'PUT',
      headers: h,
      body: JSON.stringify({
        questions: qIds,
        total_questions: qIds.length,
      }),
    }),
  );
  if (linked.status !== 'success') throw new Error('Link questions: ' + JSON.stringify(linked));
  console.log('✓ link questions to test');

  const published = await json(
    await fetch(`${BASE}/tests/${testId}`, {
      method: 'PUT',
      headers: h,
      body: JSON.stringify({ status: 'live' }),
    }),
  );
  if (published.data?.status !== 'live') {
    console.log('publish response', published);
  }
  console.log('✓ publish (status:', published.data?.status, ')');
  console.log('\nAll API flow checks passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
