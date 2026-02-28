DELIMITER $$
CREATE PROCEDURE fetch_latest_approved_entries_aggregated(
    IN p_entry_id VARCHAR(255),
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    SET p_offset = IFNULL(p_offset, 0);
    SET p_limit = IFNULL(p_limit, 2147483647);

    SELECT ea.*
    FROM entries_aggregated ea
    INNER JOIN latest_approved la
        ON ea.entry_id = la.entry_id
       AND ea.submission_id = la.latest
    WHERE p_entry_id IS NULL OR ea.entry_id = p_entry_id
    ORDER BY ea.approved_at DESC, ea.submission_id DESC
    LIMIT p_limit OFFSET p_offset;
END $$
DELIMITER ;