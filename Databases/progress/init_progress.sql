CREATE TABLE IF NOT EXISTS "CustomerProgress"
(
    "Id"
    UUID
    PRIMARY
    KEY,
    "UserId"
    UUID
    NOT
    NULL,
    "Step"
    INTEGER
    NOT
    NULL,
    "CreatedAt"
    TIMESTAMPTZ
    NOT
    NULL,
    "UpdatedAt"
    TIMESTAMPTZ
    NOT
    NULL
);

-- Index on UserId (unique)
CREATE UNIQUE INDEX IF NOT EXISTS "IX_CustomerProgress_UserId"
    ON "CustomerProgress" ("UserId");

-- Insert CustomerProgress record
DO
$$
BEGIN
    IF
NOT EXISTS (SELECT 1 FROM "CustomerProgress" WHERE "UserId" = '0198bd14-b120-7de2-809a-83bcea0c4080') THEN
        INSERT INTO "CustomerProgress" (
            "Id", "UserId", "Step", "CreatedAt", "UpdatedAt"
        )
        VALUES (
            gen_random_uuid(),
            '0198bd14-b120-7de2-809a-83bcea0c4080',
            1,
            NOW(),
            NOW()
        );
END IF;
END
$$;