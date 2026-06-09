CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  verified    BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  category     VARCHAR(50) CHECK (category IN ('road','water','electricity','sanitation','other')),
  status       VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  upvotes      INT DEFAULT 0,
  user_id      INT REFERENCES users(id) ON DELETE SET NULL,
  location     GEOGRAPHY(POINT, 4326) NOT NULL,
  address      VARCHAR(300),
  image_url    VARCHAR(500),
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS issues_location_idx ON issues USING GIST(location);
CREATE INDEX IF NOT EXISTS issues_status_idx   ON issues(status);
CREATE INDEX IF NOT EXISTS issues_category_idx ON issues(category);