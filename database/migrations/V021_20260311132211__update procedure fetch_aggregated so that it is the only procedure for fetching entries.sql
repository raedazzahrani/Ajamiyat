DELIMITER $$

DROP PROCEDURE IF EXISTS fetch_aggregated$$

CREATE PROCEDURE fetch_aggregated(
    IN p_submission_id INT,
    IN p_entry_id VARCHAR(255),
    IN p_only_latest_approved_flag BOOLEAN,
    IN p_search_term VARCHAR(255),
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
	SET p_offset = IFNULL(p_offset, 0);
    SET p_limit = IFNULL(p_limit, 2147483647);

    SELECT ala.*
    FROM aggregated_latest_approved ala
    WHERE (p_submission_id IS NULL OR ala.submission_id = p_submission_id)
      AND (p_entry_id IS NULL OR ala.entry_id = p_entry_id)
      AND (p_only_latest_approved_flag IS FALSE OR ala.latest_approved = ala.submission_id)
      AND (
            p_search_term IS NULL
            OR JSON_SEARCH(ala.forms, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
            OR JSON_SEARCH(ala.examples, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
            OR JSON_SEARCH(ala.meanings, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
          )
    ORDER BY ala.submission_id DESC
    LIMIT p_limit OFFSET p_offset;
END $$

DELIMITER ;