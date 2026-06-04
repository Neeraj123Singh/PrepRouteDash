const BASE = 'https://admin-moderator-backend-staging.up.railway.app/api';

async function main() {
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'vedant-admin', password: 'vedant123' }),
  });
  const login = await loginRes.json();
  const token = login.data?.token;
  if (!token) {
    console.error('login failed', login);
    process.exit(1);
  }
  const h = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const subjects = await (await fetch(`${BASE}/subjects`, { headers: h })).json();
  const sub = subjects.data?.[0];
  console.log('subject sample:', JSON.stringify(sub));

  const topics = await (
    await fetch(`${BASE}/topics/subject/${sub.id}`, { headers: h })
  ).json();
  const topic = topics.data?.[0];
  console.log('topic sample:', JSON.stringify(topic));

  const attempts = [
    {
      label: 'id subject + practice',
      body: {
        name: 'Probe Test A',
        subject: String(sub.id),
        type: 'practice',
        topics: [String(topic.id)],
        sub_topics: [],
        difficulty: 'easy',
        correct_marks: 5,
        wrong_marks: -1,
        unattempt_marks: 0,
        total_time: 60,
        total_marks: 100,
        total_questions: 10,
        status: 'draft',
      },
    },
    {
      label: 'name subject + chapter_wise',
      body: {
        name: 'Probe Test B',
        subject: sub.name,
        type: 'chapter_wise',
        topics: [String(topic.id)],
        sub_topics: [],
        difficulty: 'easy',
        correct_marks: 5,
        wrong_marks: -1,
        unattempt_marks: 0,
        total_time: 60,
        total_marks: 100,
        total_questions: 10,
        status: 'draft',
      },
    },
    {
      label: 'name + practice + Easy',
      body: {
        name: 'Probe Test C',
        subject: sub.name,
        type: 'practice',
        topics: [topic.id],
        sub_topics: [],
        difficulty: 'Easy',
        correct_marks: 5,
        wrong_marks: -1,
        unattempt_marks: 0,
        total_time: 60,
        total_marks: 100,
        total_questions: 10,
      },
    },
  ];

  for (const { label, body } of attempts) {
    const res = await fetch(`${BASE}/tests`, {
      method: 'POST',
      headers: h,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('\n', label, res.status, JSON.stringify(data).slice(0, 400));
  }
}

main().catch(console.error);
