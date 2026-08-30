CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS articles;

CREATE TABLE articles (
  id             text PRIMARY KEY,
  source         text NOT NULL CHECK (source IN ('code', 'convention', 'circular')),
  article_id     text NOT NULL,
  title          text NOT NULL,
  content        text NOT NULL,
  content_kind   text NOT NULL CHECK (content_kind IN ('prose', 'table')),
  effective_from date,
  effective_to   date,
  precedence     int  NOT NULL,
  embedding      vector(1024),  -- voyage-law-2; see src/llm/client.ts
  tsv            tsvector GENERATED ALWAYS AS (
                   to_tsvector('french', title || ' ' || content)
                 ) STORED
);

CREATE INDEX articles_tsv_idx ON articles USING gin (tsv);
CREATE INDEX articles_source_idx ON articles (source);

-- Naive baseline corpus: the same content re-chunked at a fixed character count.
-- Rung 1 of the ablation ladder reads this table, so the baseline is genuinely
-- naive rather than a crippled version of the good pipeline.
DROP TABLE IF EXISTS articles_fixed;

CREATE TABLE articles_fixed (
  id             text PRIMARY KEY,
  source         text NOT NULL CHECK (source IN ('code', 'convention', 'circular')),
  article_id     text NOT NULL,
  title          text NOT NULL,
  content        text NOT NULL,
  content_kind   text NOT NULL CHECK (content_kind IN ('prose', 'table')),
  effective_from date,
  effective_to   date,
  precedence     int  NOT NULL,
  embedding      vector(1024),  -- voyage-law-2; see src/llm/client.ts
  tsv            tsvector GENERATED ALWAYS AS (
                   to_tsvector('french', title || ' ' || content)
                 ) STORED
);

CREATE INDEX articles_fixed_tsv_idx ON articles_fixed USING gin (tsv);
