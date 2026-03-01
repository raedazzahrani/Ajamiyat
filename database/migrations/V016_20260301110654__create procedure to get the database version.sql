DELIMITER $$

CREATE PROCEDURE get_db_version()
BEGIN
    SELECT version
    FROM flyway_schema_history
    WHERE success = 1
    ORDER BY installed_rank DESC
    LIMIT 1;
END $$

DELIMITER ;