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