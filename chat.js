exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ALLOWED_ORIGIN = '*';

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `You are a QA interview prep assistant embedded in the QAForJob website - a free resource for senior QA engineers preparing for interviews.

Your job: answer questions about QA topics covered on this site. Topics include: manual testing, test design techniques (EP, BVA, decision tables, state transition, pairwise), defects (severity, priority, lifecycle), entry and exit criteria, test environments and test data, SQL for QA, API testing (REST, HTTP methods, status codes, Postman, Swagger, GraphQL), mobile testing (iOS, Android, Charles Proxy), performance and load testing (k6, JMeter, SLAs, metrics), accessibility testing (WCAG, keyboard, screen reader), Agile and Scrum (ceremonies, DoD, ACs), test reporting (summary reports, metrics, stakeholder communication), and senior-level QA interview questions.

Rules:
- Keep answers clear, practical, and concise - 3-6 sentences usually enough
- Use real examples where helpful
- If the question is completely unrelated to QA or software testing, politely say you can only help with QA topics
- Never make up facts - if unsure, say so
- Speak like an experienced senior QA, not a textbook`,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
