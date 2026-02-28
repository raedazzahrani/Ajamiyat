CREATE OR REPLACE VIEW latest_approved AS
SELECT entry_id, MAX(submission_id) as latest
FROM entries
WHERE approved_at IS NOT NULL
GROUP BY entry_id;