
CREATE TABLE t_p65018350_max_bot_creator.bots (
  id SERIAL PRIMARY KEY,
  user_session VARCHAR(64) NOT NULL,
  bot_name VARCHAR(255) NOT NULL,
  telegram_token VARCHAR(512) NOT NULL,
  telegram_username VARCHAR(255),
  description TEXT,
  scenario JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bots_session ON t_p65018350_max_bot_creator.bots(user_session);
CREATE INDEX idx_bots_created ON t_p65018350_max_bot_creator.bots(created_at DESC);
