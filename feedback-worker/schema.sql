CREATE TABLE IF NOT EXISTS feedback_votes (
  article TEXT NOT NULL,
  visitor TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('useful', 'unhelpful')),
  PRIMARY KEY (article, visitor)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS feedback_totals (
  article TEXT PRIMARY KEY,
  useful INTEGER NOT NULL DEFAULT 0 CHECK (useful >= 0),
  unhelpful INTEGER NOT NULL DEFAULT 0 CHECK (unhelpful >= 0)
) WITHOUT ROWID;

CREATE TRIGGER IF NOT EXISTS feedback_insert AFTER INSERT ON feedback_votes
BEGIN
  INSERT INTO feedback_totals (article, useful, unhelpful)
  VALUES (NEW.article, NEW.vote = 'useful', NEW.vote = 'unhelpful')
  ON CONFLICT(article) DO UPDATE SET
    useful = useful + excluded.useful,
    unhelpful = unhelpful + excluded.unhelpful;
END;

CREATE TRIGGER IF NOT EXISTS feedback_delete AFTER DELETE ON feedback_votes
BEGIN
  UPDATE feedback_totals SET
    useful = useful - (OLD.vote = 'useful'),
    unhelpful = unhelpful - (OLD.vote = 'unhelpful')
  WHERE article = OLD.article;
END;

CREATE TRIGGER IF NOT EXISTS feedback_change AFTER UPDATE OF vote ON feedback_votes
WHEN OLD.vote <> NEW.vote
BEGIN
  UPDATE feedback_totals SET
    useful = useful + (NEW.vote = 'useful') - (OLD.vote = 'useful'),
    unhelpful = unhelpful + (NEW.vote = 'unhelpful') - (OLD.vote = 'unhelpful')
  WHERE article = NEW.article;
END;
