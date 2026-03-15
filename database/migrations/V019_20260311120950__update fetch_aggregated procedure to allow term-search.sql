DELIMITER $$

DROP PROCEDURE IF EXISTS fetch_aggregated$$

CREATE PROCEDURE fetch_aggregated(
    IN p_submission_id INT,
    IN p_entry_id VARCHAR(255),
    IN p_search_term VARCHAR(255)
)
BEGIN
    SELECT ea.*
    FROM entries_aggregated ea
    WHERE (p_submission_id IS NULL OR ea.submission_id = p_submission_id)
      AND (p_entry_id IS NULL OR ea.entry_id = p_entry_id)
      AND (
            p_search_term IS NULL
            OR JSON_SEARCH(ea.forms, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
            OR JSON_SEARCH(ea.examples, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
            OR JSON_SEARCH(ea.meanings, 'one', CONCAT('%', p_search_term, '%')) IS NOT NULL
          )
    ORDER BY ea.submission_id DESC;
END $$

DELIMITER ;