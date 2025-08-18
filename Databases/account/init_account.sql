-- Create Addresses table
CREATE TABLE IF NOT EXISTS "Addresses"
(
    "Id"
    UUID
    PRIMARY
    KEY,
    "Street"
    VARCHAR
(
    50
) NOT NULL,
    "HsApt" VARCHAR
(
    10
) NOT NULL,
    "City" VARCHAR
(
    30
) NOT NULL,
    "Country" VARCHAR
(
    30
) NOT NULL,
    "Postcode" VARCHAR
(
    10
) NOT NULL,
    "CorrStreet" VARCHAR
(
    50
),
    "CorrHsApt" VARCHAR
(
    10
),
    "CorrCity" VARCHAR
(
    30
),
    "CorrCountry" VARCHAR
(
    30
),
    "CorrPostcode" VARCHAR
(
    10
)
    );

-- Create CustomerPersonals table
CREATE TABLE IF NOT EXISTS "CustomerPersonals"
(
    "Id"
    UUID
    PRIMARY
    KEY,
    "Birthday"
    DATE
    NOT
    NULL,
    "BirthPlace"
    VARCHAR
(
    50
) NOT NULL,
    "CountryOfBirth" VARCHAR
(
    30
) NOT NULL,
    "FathersName" VARCHAR
(
    20
) NOT NULL,
    "MothersName" VARCHAR
(
    20
) NOT NULL,
    "Nationality" VARCHAR
(
    30
) NOT NULL,
    "IdNumber" VARCHAR
(
    50
) NOT NULL,
    "CountryOfIssue" VARCHAR
(
    30
) NOT NULL,
    "ContactName" VARCHAR
(
    20
) NOT NULL,
    "ContactSurname" VARCHAR
(
    50
) NOT NULL,
    "Relationship" VARCHAR
(
    50
) NOT NULL,
    "ContactPhone" VARCHAR
(
    20
) NOT NULL,
    "EducationLevel" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL,
    "UpdatedAt" TIMESTAMPTZ NOT NULL
    );

-- Create CustomerContacts table
CREATE TABLE IF NOT EXISTS "CustomerContacts"
(
    "Id"
    UUID
    PRIMARY
    KEY,
    "Name"
    VARCHAR
(
    20
) NOT NULL,
    "Surname" VARCHAR
(
    50
) NOT NULL,
    "Phone" VARCHAR
(
    20
) NOT NULL,
    "Gender" INTEGER NOT NULL,
    "TypeOfSettlement" INTEGER NOT NULL,
    "MiddleName" VARCHAR
(
    20
),
    "MaidenName" VARCHAR
(
    20
),
    "AddressId" UUID NOT NULL,
    "CreatedAt" TIMESTAMPTZ NOT NULL,
    "UpdatedAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "FK_CustomerContacts_Addresses_AddressId" FOREIGN KEY
(
    "AddressId"
)
    REFERENCES "Addresses"
(
    "Id"
) ON DELETE CASCADE
    );

-- Create CustomerAccounts table
CREATE TABLE IF NOT EXISTS "CustomerAccounts"
(
    "Id"
    UUID
    PRIMARY
    KEY,
    "UserId"
    UUID
    NOT
    NULL,
    "LanguageId"
    UUID,
    "SchoolId"
    UUID,
    "CourseId"
    UUID,
    "IsActive"
    BOOLEAN
    NOT
    NULL,
    "IsApplicationComplete"
    BOOLEAN
    NOT
    NULL,
    "ApplicationNote"
    TEXT,
    "ContactId"
    UUID,
    "PersonalId"
    UUID,
    "CreatedAt"
    TIMESTAMPTZ
    NOT
    NULL,
    "UpdatedAt"
    TIMESTAMPTZ
    NOT
    NULL,
    CONSTRAINT
    "FK_CustomerAccounts_CustomerContacts_ContactId"
    FOREIGN
    KEY
(
    "ContactId"
)
    REFERENCES "CustomerContacts"
(
    "Id"
),
    CONSTRAINT "FK_CustomerAccounts_CustomerPersonals_PersonalId" FOREIGN KEY
(
    "PersonalId"
)
    REFERENCES "CustomerPersonals"
(
    "Id"
)
    );

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "IX_CustomerAccounts_ContactId" ON "CustomerAccounts" ("ContactId");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_CustomerAccounts_PersonalId" ON "CustomerAccounts" ("PersonalId");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_CustomerAccounts_UserId" ON "CustomerAccounts" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_CustomerContacts_AddressId" ON "CustomerContacts" ("AddressId");


-- Insert CustomerAccount
DO
$$
BEGIN
    IF
NOT EXISTS (SELECT 1 FROM "CustomerAccounts" WHERE "Id" = '0238bd14-b120-7de2-801a-82bcea0c4055') THEN
        INSERT INTO "CustomerAccounts" (
            "Id", "UserId", "LanguageId", "SchoolId", "CourseId",
            "IsActive", "IsApplicationComplete", "ApplicationNote",
            "ContactId", "PersonalId", "CreatedAt", "UpdatedAt"
        )
        VALUES (
            '0238bd14-b120-7de2-801a-82bcea0c4055',
            '0198bd14-b120-7de2-809a-83bcea0c4080',
            NULL, NULL, NULL,
            TRUE, FALSE,
            NULL,
            NULL, NULL,
            NOW(), NOW()
        );
END IF;
END
$$;
