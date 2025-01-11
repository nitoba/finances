UPDATE expenses
SET
    created_at = strftime ('%s', date), -- Converte o texto para UNIX timestamp
    updated_at = strftime ('%s', date) -- Usa o mesmo valor para updatedAt
WHERE
    created_at IS NULL
    OR updated_at IS NULL;

ALTER TABLE expenses
ALTER COLUMN created_at
SET DEFAULT (strftime ('%s', 'now'));

ALTER TABLE expenses
ALTER COLUMN updated_at
SET DEFAULT (strftime ('%s', 'now'));