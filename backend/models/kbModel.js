const db = require('../config/db');

// kb_topics / kb_articles live in the shared public schema (see
// database/databasse.sql). Managed (created/edited) from apps/dashboard's
// Knowledge Base admin — this app only reads them at runtime. Table creation
// here is IF NOT EXISTS, so it's a no-op against the real shared DB and a
// self-init against a fresh/standalone Postgres.
const createKbTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS kb_topics (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS kb_articles (
      id SERIAL PRIMARY KEY,
      topic_id INTEGER NOT NULL REFERENCES kb_topics(id) ON DELETE CASCADE,
      title VARCHAR(300) NOT NULL,
      body TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_kb_articles_topic_id ON kb_articles(topic_id);
  `;
  await db.query(queryText);
};

const getTopics = async () => {
  const queryText = `
    SELECT t.id, t.slug, t.name, t.sort_order,
           COUNT(a.id)::int AS article_count
    FROM kb_topics t
    LEFT JOIN kb_articles a ON a.topic_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order, t.name;
  `;
  const result = await db.query(queryText);
  return result.rows;
};

const getTopicBySlug = async (slug) => {
  const result = await db.query(`SELECT * FROM kb_topics WHERE slug = $1`, [slug]);
  return result.rows[0];
};

const getArticlesByTopicSlug = async (slug) => {
  const result = await db.query(
    `SELECT a.id, a.title, a.sort_order, a.created_at, a.updated_at, t.slug AS topic_slug, t.name AS topic_name
     FROM kb_articles a
     JOIN kb_topics t ON t.id = a.topic_id
     WHERE t.slug = $1
     ORDER BY a.sort_order, a.id`,
    [slug]
  );
  return result.rows;
};

const getArticleById = async (id) => {
  const result = await db.query(
    `SELECT a.*, t.slug AS topic_slug, t.name AS topic_name
     FROM kb_articles a
     JOIN kb_topics t ON t.id = a.topic_id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

const searchArticles = async (searchTerm, topicSlug) => {
  const values = [`%${searchTerm}%`];
  let topicClause = '';
  if (topicSlug) {
    values.push(topicSlug);
    topicClause = `AND t.slug = $${values.length}`;
  }
  const queryText = `
    SELECT a.id, a.title, a.body, t.slug AS topic_slug, t.name AS topic_name
    FROM kb_articles a
    JOIN kb_topics t ON t.id = a.topic_id
    WHERE (a.title ILIKE $1 OR a.body ILIKE $1)
    ${topicClause}
    ORDER BY t.sort_order, a.sort_order
    LIMIT 30;
  `;
  const result = await db.query(queryText, values);
  return result.rows;
};

module.exports = {
  createKbTables,
  getTopics,
  getTopicBySlug,
  getArticlesByTopicSlug,
  getArticleById,
  searchArticles,
};
