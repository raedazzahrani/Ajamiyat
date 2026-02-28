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