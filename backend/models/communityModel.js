const db = require('../config/db');

// community_questions / community_replies live in the shared public schema
// (see database/databasse.sql) — table creation here is IF NOT EXISTS, so it's
// a no-op against the real shared DB (where these already exist) and a
// self-init against a fresh/standalone Postgres (e.g. before this app is
// pointed at the shared instance).
const createCommunityTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS community_questions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      title VARCHAR(200) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS community_replies (
      id SERIAL PRIMARY KEY,
      question_id INTEGER NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_community_replies_question_id ON community_replies(question_id);
  `;
  await db.query(queryText);
};

const createQuestion = async (data) => {
  const queryText = `
    INSERT INTO community_questions (name, email, title, body)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [data.name, data.email || null, data.title, data.body];
  const result = await db.query(queryText, values);
  return result.rows[0];
};

const getQuestions = async ({ search, filter } = {}) => {
  const values = [];
  let whereClause = '';
  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);
    whereClause = `WHERE q.title ILIKE $${values.length} OR q.body ILIKE $${values.length}`;
  }

  const havingClause = filter === 'unanswered' ? 'HAVING COUNT(r.id) = 0' : '';
  const orderClause = filter === 'most-replies'
    ? 'ORDER BY reply_count DESC, q.created_at DESC'
    : 'ORDER BY q.created_at DESC';

  const queryText = `
    SELECT q.id, q.name, q.title, q.body, q.created_at,
           COUNT(r.id)::int AS reply_count
    FROM community_questions q
    LEFT JOIN community_replies r ON r.question_id = q.id
    ${whereClause}
    GROUP BY q.id
    ${havingClause}
    ${orderClause};
  `;
  const result = await db.query(queryText, values);
  return result.rows;
};

const getQuestionById = async (id) => {
  const result = await db.query(`SELECT * FROM community_questions WHERE id = $1`, [id]);
  return result.rows[0];
};

const getRepliesForQuestion = async (questionId) => {
  const result = await db.query(
    `SELECT * FROM community_replies WHERE question_id = $1 ORDER BY created_at ASC`,
    [questionId]
  );
  return result.rows;
};

const createReply = async (data) => {
  const queryText = `
    INSERT INTO community_replies (question_id, name, email, body)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [data.questionId, data.name, data.email || null, data.body];
  const result = await db.query(queryText, values);
  return result.rows[0];
};

module.exports = {
  createCommunityTables,
  createQuestion,
  getQuestions,
  getQuestionById,
  getRepliesForQuestion,
  createReply,
};
