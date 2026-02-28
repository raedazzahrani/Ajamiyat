DELIMITER $$  
CREATE PROCEDURE insert_component_json(
    IN p_json JSON,
    IN p_submission_id INT,
    IN p_table VARCHAR(255),
    IN p_column VARCHAR(255)
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE n INT DEFAULT 0;
    DECLARE v_val TEXT;

    SET n = JSON_LENGTH(p_json);

    WHILE i < n DO
        SET v_val = JSON_UNQUOTE(JSON_EXTRACT(p_json, CONCAT('$[', i, ']')));
        SET @s = CONCAT('INSERT INTO ', p_table, ' (submission_id, ', p_column, ') VALUES (?, ?)');
        PREPARE stmt FROM @s;
        SET @id = p_submission_id;
        SET @val = v_val;
        EXECUTE stmt USING @id, @val;
        DEALLOCATE PREPARE stmt;
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;