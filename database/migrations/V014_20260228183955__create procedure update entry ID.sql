DELIMITER $$
CREATE PROCEDURE update_entry_id(
    IN p_old_entry_id VARCHAR(255),
    IN p_new_entry_id VARCHAR(255)
)

BEGIN
    UPDATE entries SET entry_id = p_new_entry_id
    WHERE entry_id = p_old_entry_id;
END $$
DELIMITER ;