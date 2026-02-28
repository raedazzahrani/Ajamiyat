-- 1 SKIP THIS!!!
CREATE TABLE temp_mapping AS
SELECT entry_id, @rownum := @rownum + 1 AS new_id
FROM (SELECT DISTINCT entry_id FROM entries ORDER BY entry_id) AS t
JOIN (SELECT @rownum := 0) AS r;


-- 2 SKIP THIS!!!
UPDATE entries e
JOIN temp_mapping m ON e.entry_id = m.entry_id
SET e.entry_id = m.new_id;

-- 3 SKIP THIS!!!
ALTER TABLE entries
MODIFY COLUMN entry_id INT NULL;


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
DELIMITER ;   -- reset delimiter back to semicolon



-- 5
DELIMITER $$
CREATE PROCEDURE insert_submission_json(
    IN p_entry JSON
)
BEGIN
    DECLARE v_submission_id INT;
    DECLARE v_value TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF NOT JSON_VALID(p_entry) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid JSON input';
    END IF;

    START TRANSACTION;

    INSERT INTO entries (origin, original, entry_id)
    VALUES (
	    JSON_VALUE(p_entry, '$.origin'),
	    JSON_VALUE(p_entry, '$.original'),
	    JSON_VALUE(p_entry, '$.entry_id')
    );

    SET v_submission_id = LAST_INSERT_ID();

    IF JSON_VALUE(p_entry, '$.entry_id') IS NULL THEN
        UPDATE entries
        SET entry_id = v_submission_id
        WHERE submission_id = v_submission_id;
    END IF;

    CALL insert_component_json(JSON_VALUE(p_entry, '$.categories'), v_submission_id, 'entry_categories', 'category');
    CALL insert_component_json(JSON_VALUE(p_entry, '$.examples'),   v_submission_id, 'entry_examples',   'example');
    CALL insert_component_json(JSON_VALUE(p_entry, '$.forms'),      v_submission_id, 'entry_forms',      'form');
    CALL insert_component_json(JSON_VALUE(p_entry, '$.meanings'),   v_submission_id, 'entry_meanings',   'meaning');
    CALL insert_component_json(JSON_VALUE(p_entry, '$.sources'),    v_submission_id, 'entry_sources',    'source');

    SELECT v_submission_id as submission_id;
    COMMIT;

END $$
DELIMITER ;


-- 6
DROP TABLE temp_mapping;

-- 7
CREATE OR REPLACE VIEW entries_aggregated AS
SELECT 
    e.*,
    c.categories,
    x.examples,
    f.forms,
    m.meanings,
    s.sources
FROM entries e
LEFT JOIN (
    SELECT submission_id,
           JSON_ARRAYAGG(category) AS categories
    FROM entry_categories
    GROUP BY submission_id
) c ON c.submission_id = e.submission_id
LEFT JOIN (
    SELECT submission_id,
           JSON_ARRAYAGG(example) AS examples
    FROM entry_examples
    GROUP BY submission_id
) x ON x.submission_id = e.submission_id
LEFT JOIN (
    SELECT submission_id,
           JSON_ARRAYAGG(form) AS forms
    FROM entry_forms
    GROUP BY submission_id
) f ON f.submission_id = e.submission_id
LEFT JOIN (
    SELECT submission_id,
           JSON_ARRAYAGG(meaning) AS meanings
    FROM entry_meanings
    GROUP BY submission_id
) m ON m.submission_id = e.submission_id
LEFT JOIN (
    SELECT submission_id,
           JSON_ARRAYAGG(source) AS sources
    FROM entry_sources
    GROUP BY submission_id
) s ON s.submission_id = e.submission_id;



-- 8
DROP VIEW aggregated_categories, aggregated_examples, aggregated_forms, aggregated_meanings, aggregated_sources;

--9
DELIMITER $$
CREATE PROCEDURE approve_submission(IN p_submission_id INT)
BEGIN
    UPDATE entries
    SET approved_at = CURRENT_TIMESTAMP
    WHERE submission_id = p_submission_id;

	SELECT ROW_COUNT() AS affected_rows;
END $$
DELIMITER ;


-- 10
CREATE OR REPLACE VIEW latest_approved AS
SELECT entry_id, MAX(submission_id) as latest
FROM entries
WHERE approved_at IS NOT NULL
GROUP BY entry_id;



-- 11
DELIMITER $$
CREATE PROCEDURE fetch_latest_approved_entries_aggregated(
    IN p_entry_id VARCHAR(255),
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    -- Handle defaults inside the procedure
    SET p_offset = IFNULL(p_offset, 0);
    SET p_limit = IFNULL(p_limit, 2147483647);  -- effectively no limit

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




-- 12
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


-- 13 FIX!!! SKIP THIS!!!
UPDATE entries e
JOIN (
    SELECT entry_id, MIN(submission_id) AS first_submission
    FROM entries
    GROUP BY entry_id
) AS roots
ON e.entry_id = roots.entry_id
SET e.entry_id = roots.first_submission;


-- 14 MAYBE SKUP
ALTER TABLE entries MODIFY entry_id VARCHAR(255) NOT NULL;

-- 15 SKIIIIIIIIIIIIIIIIP
UPDATE entries e
JOIN (
    SELECT *
    FROM (
        SELECT e2.submission_id, e2.entry_id, ef.form,
               ROW_NUMBER() OVER (PARTITION BY e2.entry_id ORDER BY e2.submission_id) AS rn
        FROM entries e2
        LEFT JOIN entry_forms ef
            ON e2.submission_id = ef.submission_id
    ) AS t
    WHERE t.rn = 1
) AS d
ON e.entry_id  = d.submission_id 
SET e.entry_id = d.form;


-- 16
ALTER TABLE entries MODIFY original VARCHAR(255);

-- 17
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