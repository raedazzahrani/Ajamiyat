DELIMITER $$
CREATE PROCEDURE fetch_submissions_aggregated(
    IN p_submission_id INT,
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    -- Handle defaults inside the procedure
    SET p_offset = IFNULL(p_offset, 0);
    SET p_limit = IFNULL(p_limit, 2147483647);  -- effectively no limit

    SELECT ea.*
    FROM entries_aggregated ea
    WHERE p_submission_id IS NULL OR ea.submission_id = p_submission_id
    ORDER BY ea.submission_id DESC
    LIMIT p_limit OFFSET p_offset;
END $$
DELIMITER ;