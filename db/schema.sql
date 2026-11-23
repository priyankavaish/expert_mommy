CREATE TABLE IF NOT EXISTS store_version (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision TEXT NOT NULL
);
INSERT OR IGNORE INTO store_version VALUES (1, 'initial');

CREATE TABLE IF NOT EXISTS store_chunks (
  revision TEXT NOT NULL,
  position INTEGER NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (revision, position)
);

CREATE TABLE IF NOT EXISTS store_media (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  bytes BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  expires INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  address TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
