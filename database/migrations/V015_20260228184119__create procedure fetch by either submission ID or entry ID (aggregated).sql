DELIMITER $$
CREATE PROCEDURE fetch_aggregated(
    IN p_submission_id INT,
    IN p_entry_id VARCHAR(255)
)
BEGIN
    SELECT ea.*
    FROM entries_aggregated ea
    WHERE (p_submission_id IS NULL OR ea.submission_id = p_submission_id) AND (p_entry_id IS NULL or ea.entry_id = p_entry_id)
    ORDER BY ea.submission_id DESC;
END $$
DELIMITER ;