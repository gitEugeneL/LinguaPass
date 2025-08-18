-- Create Roles table
DO
$$
    BEGIN
        IF
            NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Roles') THEN
            CREATE TABLE "Roles"
            (
                "Id"   UUID PRIMARY KEY,
                "Name" TEXT NOT NULL
            );
        END IF;
    END
$$;

-- Insert default Roles
DO
$$
    BEGIN
        IF
            NOT EXISTS (SELECT 1 FROM "Roles" WHERE "Id" = '00000000-0000-0000-0000-000000000001') THEN
            INSERT INTO "Roles" ("Id", "Name")
            VALUES ('00000000-0000-0000-0000-000000000001', 'ADMIN');
        END IF;

        IF
            NOT EXISTS (SELECT 1 FROM "Roles" WHERE "Id" = '00000000-0000-0000-0000-000000000002') THEN
            INSERT INTO "Roles" ("Id", "Name")
            VALUES ('00000000-0000-0000-0000-000000000002', 'CUSTOMER');
        END IF;
    END
$$;

-- Create Users table
DO
$$
    BEGIN
        IF
            NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Users') THEN
            CREATE TABLE "Users"
            (
                "Id"                 UUID PRIMARY KEY,
                "Email"              VARCHAR(250) NOT NULL,
                "PwdHash"            BYTEA        NOT NULL,
                "PwdSalt"            BYTEA        NOT NULL,
                "EmailConfirmed"     BOOLEAN      NOT NULL,
                "LoginLocked"        BOOLEAN      NOT NULL,
                "ConfirmLocked"      BOOLEAN      NOT NULL,
                "LoginFailedCount"   INTEGER      NOT NULL,
                "ConfirmFailedCount" INTEGER      NOT NULL,
                "GenerateCodeCount"  INTEGER      NOT NULL,
                "LoginLockExpires"   TIMESTAMPTZ,
                "ConfirmLockExpires" TIMESTAMPTZ,
                "CreateAt"           TIMESTAMPTZ  NOT NULL,
                "UpdateAt"           TIMESTAMPTZ  NOT NULL,
                "DeleteAt"           TIMESTAMPTZ,
                "RoleId"             UUID         NOT NULL,
                CONSTRAINT "FK_Users_Roles_RoleId" FOREIGN KEY ("RoleId")
                    REFERENCES "Roles" ("Id") ON DELETE CASCADE
            );
            CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
            CREATE INDEX "IX_Users_RoleId" ON "Users" ("RoleId");
        END IF;
    END
$$;

-- Create ConfirmationCodes table
DO
$$
    BEGIN
        IF
            NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ConfirmationCodes') THEN
            CREATE TABLE "ConfirmationCodes"
            (
                "Id"      UUID PRIMARY KEY,
                "Code"    TEXT        NOT NULL,
                "Expires" TIMESTAMPTZ NOT NULL,
                "UserId"  UUID        NOT NULL,
                CONSTRAINT "FK_ConfirmationCodes_Users_UserId" FOREIGN KEY ("UserId")
                    REFERENCES "Users" ("Id") ON DELETE CASCADE
            );
            CREATE UNIQUE INDEX "IX_ConfirmationCodes_UserId" ON "ConfirmationCodes" ("UserId");
        END IF;
    END
$$;

-- Create RefreshTokens table
DO
$$
    BEGIN
        IF
            NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'RefreshTokens') THEN
            CREATE TABLE "RefreshTokens"
            (
                "Id"      UUID PRIMARY KEY,
                "Token"   TEXT        NOT NULL,
                "Expires" TIMESTAMPTZ NOT NULL,
                "UserId"  UUID        NOT NULL,
                CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId")
                    REFERENCES "Users" ("Id") ON DELETE CASCADE
            );
            CREATE INDEX "IX_RefreshTokens_UserId" ON "RefreshTokens" ("UserId");
        END IF;
    END
$$;

-- Insert test Users
DO
$$
    BEGIN
        IF
            EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Users')
                AND NOT EXISTS (SELECT 1 FROM "Users") THEN

            INSERT INTO "Users" ("Id", "Email", "PwdHash", "PwdSalt", "EmailConfirmed", "LoginLocked",
                                 "ConfirmLocked", "LoginFailedCount", "ConfirmFailedCount", "GenerateCodeCount",
                                 "LoginLockExpires", "ConfirmLockExpires", "CreateAt", "UpdateAt", "RoleId")
            VALUES ('0198bd14-b120-7de2-809a-83bcea0c4080', 'DEV@DEV.COM',
                    decode(
                            'C413B59B5E82D316BB896F79C840D0540409AA1153AC71996B3784C2F698802772EC2DFA15E2AD1C76C3AA7514D70E0E7954FEF4518BF69353E3845484C1AD3F',
                            'hex'),
                    decode(
                            '3F5BFF97EA8E4B375C85BD1A45E96B21AE1CBFED593D5B75711BBD0E4975C297535EB7E4A4039976FCCF1AE6476B471F4D4CAFEEC24103FA32BAFA6B6BBEC328902B125F32BB69411EFD0461C65B4B6B5430B7855E36D0AE49F29D468DCCBA20922C58166EDC67C886CFD03C9046047B086D5EE5E7FC76ADE10A9DFFF6F6E317',
                            'hex'),
                    false, false, false, 0, 0, 0, NULL, NULL, NOW(), NOW(), '00000000-0000-0000-0000-000000000002'),

                   ('0198bd15-0bd6-7571-a8d6-843794904f2b', 'ADMIN@DEV.COM',
                    decode(
                            'C413B59B5E82D316BB896F79C840D0540409AA1153AC71996B3784C2F698802772EC2DFA15E2AD1C76C3AA7514D70E0E7954FEF4518BF69353E3845484C1AD3F',
                            'hex'),
                    decode(
                            '3F5BFF97EA8E4B375C85BD1A45E96B21AE1CBFED593D5B75711BBD0E4975C297535EB7E4A4039976FCCF1AE6476B471F4D4CAFEEC24103FA32BAFA6B6BBEC328902B125F32BB69411EFD0461C65B4B6B5430B7855E36D0AE49F29D468DCCBA20922C58166EDC67C886CFD03C9046047B086D5EE5E7FC76ADE10A9DFFF6F6E317',
                            'hex'),
                    true, false, false, 0, 0, 0, NULL, NULL, NOW(), NOW(), '00000000-0000-0000-0000-000000000001');
        END IF;
    END
$$;


