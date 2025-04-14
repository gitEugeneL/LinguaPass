-- Insert into "Languages" table
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Languages')
            AND NOT EXISTS (SELECT 1 FROM "Languages") THEN

            INSERT INTO "Languages" ("Id", "Name", "Description", "IsActive")
            VALUES ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', 'English',
                    'Start your learning journey and create a solid base for your studies with language course.', true),
                   ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', 'Spanish',
                    'Discover the rich Hispanic culture through this comprehensive Spanish language course.', true),
                   ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', 'French',
                    'Master the language of romance and diplomacy with our French course.', true),
                   ('770e8400-e29b-41d4-a716-446655440002', 'German',
                    'Learn German and unlock opportunities in Europe''s economic powerhouse.', true),
                   ('660e8400-e29b-41d4-a716-446655440002',
                    'Italian', 'Immerse yourself in the beauty of Italian language and culture.', true),
                   ('660e8400-e29b-41d4-a716-446655440003', 'Japanese',
                    'Explore the fascinating world of Japanese language and traditions.', true),
                   ('660e8400-e29b-41d4-a716-446655440001', 'Chinese',
                    'Master Mandarin Chinese and connect with over a billion speakers.', true),
                   ('8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', 'Portugal',
                    'Learn Portugal and discover a rich literary and cultural heritage.', true);
        END IF;
    END
$$;

-- Insert into "Countries" table
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Countries')
            AND NOT EXISTS (SELECT 1 FROM "Countries") THEN

            INSERT INTO "Countries" ("Id", "Name", "IsActive")
            VALUES ('c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a', 'Poland', true),
                   ('d0e5f8a3-2c7a-4f4e-9b6a-8a1d6c3e5f7b', 'Malta', true),
                   ('e1f6a9b4-3d8b-4f5f-9c7b-9b2e7d4f6a8c', 'United Kingdom', true),
                   ('f2a7b0c5-4e9c-4f6a-9d8c-0c3f8e5a7b9d', 'United States', true),
                   ('a3b8c1d6-5f0d-4f7b-9e9d-1d4a9f6b8c0e', 'Spain', true),
                   ('b4c9d2e7-6a1e-4f8c-9f0e-2e5b0a7c9d1f', 'France', true),
                   ('c5d0e3f8-7b2f-4f9d-0a1f-3f6c1b8d0e2a', 'Germany', true),
                   ('d6e1f4a9-8c3a-4f0e-0b2a-4a7d2c9e1f3b', 'UAE', true);
        END IF;
    END
$$;

-- Insert into "Schools" table
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Schools')
            AND NOT EXISTS (SELECT 1 FROM "Schools") THEN
            INSERT INTO "Schools" ("Id", "Name", "ShortName", "City", "IsActive", "CountryId")
            VALUES ('efca49e2-47e5-4f60-ae60-9b399dd2f939', 'Warsaw Language Academy', 'WLA', 'Warsaw', true,
                    'c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a'), -- Poland
                   ('28e277ae-06fe-4924-b301-ad592cc29319', 'Krakow Language Institute', 'KLI', 'Krakow', true,
                    'c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a'), -- Poland
                   ('02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f', 'Global Language Academy', 'GLA', 'Warsaw', true,
                    'c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a'), -- Poland
                   ('9e2017d8-615c-4ee6-9036-26c9e3027ef6', 'Lingua Bridge Institute', 'LBI', 'Warsaw', true,
                    'c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a'), -- Poland
                   ('0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452', 'International School of Languages', 'ISL', 'Krakow', true,
                    'c9d4e7f2-1b6f-4e3d-8a5f-7f0c5b2d4e6a'),-- Poland
                   ('123e4567-e89b-12d3-a456-426614174000', 'Middle-sex University Malta', 'MSUM', 'Valletta', true,
                    'd0e5f8a3-2c7a-4f4e-9b6a-8a1d6c3e5f7b'), -- Malta
                   ('123e4567-e89b-12d3-a456-426614174100', 'Cosmopolitan School of Languages', 'CSOL', 'Valletta',
                    true,
                    'd0e5f8a3-2c7a-4f4e-9b6a-8a1d6c3e5f7b'), -- Malta
                   ('37b5d1b7-ec01-466d-837d-0098a175c250', 'Language Excellence Academy', 'LEA', 'Valletta', true,
                    'd0e5f8a3-2c7a-4f4e-9b6a-8a1d6c3e5f7b'),-- Malta
                   ('123e4567-e89b-12d3-a456-426614174001', 'London Language Institute', 'LEI', 'London', true,
                    'e1f6a9b4-3d8b-4f5f-9c7b-9b2e7d4f6a8c'), -- UK
                   ('db1239a3-1d58-4430-9eaa-e29fe6dee5e4', 'Academic Language Center', 'ACLC', 'Oxford', true,
                    'e1f6a9b4-3d8b-4f5f-9c7b-9b2e7d4f6a8c'),-- UK
                   ('123e4567-e89b-12d3-a456-426614174002', 'New York Language Center', 'NYLC', 'New York', true,
                    'f2a7b0c5-4e9c-4f6a-9d8c-0c3f8e5a7b9d'), -- USA
                   ('123e4567-e89b-12d3-a456-426614174003', 'Madrid Language School', 'MSS', 'Madrid', true,
                    'a3b8c1d6-5f0d-4f7b-9e9d-1d4a9f6b8c0e'), --Spain
                   ('123e4567-e89b-12d3-a456-426614174006', 'Dubai Language Hub', 'DLH', 'Dubai', true,
                    'd6e1f4a9-8c3a-4f0e-0b2a-4a7d2c9e1f3b'), -- UAE
                   ('123e4567-e89b-12d3-a456-426614174004', 'Paris French Academy', 'PFA', 'Paris', true,
                    'b4c9d2e7-6a1e-4f8c-9f0e-2e5b0a7c9d1f'), -- France
                   ('123e4567-e89b-12d3-a456-426614174005', 'Berlin Language Institute', 'BGI', 'Berlin', true,
                    'c5d0e3f8-7b2f-4f9d-0a1f-3f6c1b8d0e2a'); -- Germany
        END IF;
    END
$$;

-- Insert into "LanguageSchool" table
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'LanguageSchool')
            AND NOT EXISTS (SELECT 1 FROM "LanguageSchool") THEN
            INSERT INTO "LanguageSchool" ("LanguagesId", "SchoolsId")
            VALUES
                -- Warsaw Language Academy
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('770e8400-e29b-41d4-a716-446655440002', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('660e8400-e29b-41d4-a716-446655440002', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('660e8400-e29b-41d4-a716-446655440003', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('660e8400-e29b-41d4-a716-446655440001', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', 'efca49e2-47e5-4f60-ae60-9b399dd2f939'),
                -- Krakow Language Institute 
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '28e277ae-06fe-4924-b301-ad592cc29319'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '28e277ae-06fe-4924-b301-ad592cc29319'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '28e277ae-06fe-4924-b301-ad592cc29319'),
                ('770e8400-e29b-41d4-a716-446655440002', '28e277ae-06fe-4924-b301-ad592cc29319'),
                -- Global Language Academy
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f'),
                ('660e8400-e29b-41d4-a716-446655440003', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f'),
                ('660e8400-e29b-41d4-a716-446655440001', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f'),
                -- Lingua Bridge Institute
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '9e2017d8-615c-4ee6-9036-26c9e3027ef6'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '9e2017d8-615c-4ee6-9036-26c9e3027ef6'),
                ('770e8400-e29b-41d4-a716-446655440002', '9e2017d8-615c-4ee6-9036-26c9e3027ef6'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', '9e2017d8-615c-4ee6-9036-26c9e3027ef6'),
                -- International School of Languages
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452'),
                ('660e8400-e29b-41d4-a716-446655440002', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452'),
                ('660e8400-e29b-41d4-a716-446655440003', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452'),
                -- Middle-sex University Malta
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174000'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174000'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174000'),
                -- Cosmopolitan School of Languages
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174100'),
                ('770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174100'),
                ('660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174100'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', '123e4567-e89b-12d3-a456-426614174100'),
                -- Language Excellence Academy
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '37b5d1b7-ec01-466d-837d-0098a175c250'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '37b5d1b7-ec01-466d-837d-0098a175c250'),
                ('660e8400-e29b-41d4-a716-446655440001', '37b5d1b7-ec01-466d-837d-0098a175c250'),
                -- London Language Institute
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174001'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174001'),
                ('770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174001'),
                ('660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174001'),
                -- Academic Language Center
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', 'db1239a3-1d58-4430-9eaa-e29fe6dee5e4'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', 'db1239a3-1d58-4430-9eaa-e29fe6dee5e4'),
                ('660e8400-e29b-41d4-a716-446655440003', 'db1239a3-1d58-4430-9eaa-e29fe6dee5e4'),
                -- New York Language Center
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174002'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174002'),
                ('660e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174002'),
                ('770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174002'),
                -- Madrid Language School
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174003'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174003'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174003'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', '123e4567-e89b-12d3-a456-426614174003'),
                -- Dubai Language Hub
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174006'),
                ('660e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174006'),
                ('660e8400-e29b-41d4-a716-446655440003', '123e4567-e89b-12d3-a456-426614174006'),
                -- Paris French Academy
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174004'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174004'),
                ('b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174004'),
                -- Berlin Language Institute 
                ('770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005'),
                ('8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174005'),
                ('c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174005'),
                ('660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005');
        END IF;
    END
$$;

-- Insert into "Tracks" table
DO
$$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Tracks')
            AND NOT EXISTS (SELECT 1 FROM "Tracks") THEN
            INSERT INTO "Tracks" ("Id", "Name", "Description", "Activities", "Duration", "Price", "AdmissionFee",
                                  "IsActive", "LanguageId", "SchoolId", "WithAccommodation")
            VALUES
                -- Warsaw Language Academy (WLA)
                ('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'English Beginners Intensive',
                 'A fast-paced course to kickstart your English skills.',
                 'Grammar lessons, speaking practice, vocabulary drills',
                 '8 weeks', 1200.00, 50.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', 'efca49e2-47e5-4f60-ae60-9b399dd2f939', true),
                ('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Spanish Conversation Mastery',
                 'Improve fluency with real-world Spanish conversations.',
                 'Role-playing, group discussions, listening exercises',
                 '12 weeks', 1500.00, 75.00, true,
                 'b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', 'efca49e2-47e5-4f60-ae60-9b399dd2f939', true),
                ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Japanese for Travel',
                 'Learn essential Japanese for your next trip.',
                 'Phrase practice, cultural lessons, basic writing',
                 '6 weeks', 900.00, 40.00, true,
                 '660e8400-e29b-41d4-a716-446655440003', 'efca49e2-47e5-4f60-ae60-9b399dd2f939', true),

                -- Krakow Language Institute (KLI)
                ('d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'German Business Communication',
                 'Master German for professional settings.',
                 'Business vocabulary, email writing, presentations',
                 '10 weeks', 1800.00, 100.00, true,
                 '770e8400-e29b-41d4-a716-446655440002', '28e277ae-06fe-4924-b301-ad592cc29319', true),
                ('e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'French Intermediate',
                 'Build on your French basics with this course.',
                 'Grammar review, conversation, reading comprehension',
                 '14 weeks', 1600.00, 80.00, true,
                 'c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '28e277ae-06fe-4924-b301-ad592cc29319', true),

                -- Global Language Academy (GLA)
                ('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'Chinese HSK Level 1 Prep',
                 'Prepare for the HSK Level 1 exam with confidence.',
                 'Character writing, listening practice, mock tests',
                 '10 weeks', 1400.00, 60.00, true,
                 '660e8400-e29b-41d4-a716-446655440001', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f', false),
                ('a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'English for Academic Purposes',
                 'Enhance your English for university studies.',
                 'Essay writing, lectures, critical reading',
                 '16 weeks', 2000.00, 90.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '02a4ae6c-6e18-452c-ae5a-6e6bd42ccb0f', false),

                -- Lingua Bridge Institute (LBI)
                ('b8c9d0e1-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'Portuguese Immersion',
                 'Dive deep into Portuguese language and culture.',
                 'Speaking practice, music lessons, cultural workshops',
                 '8 weeks', 1300.00, 50.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', '9e2017d8-615c-4ee6-9036-26c9e3027ef6', false),
                ('c9d0e1f2-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'Spanish for Kids',
                 'Fun and interactive Spanish course for children.',
                 'Games, songs, basic vocabulary',
                 '6 weeks', 800.00, 30.00, true,
                 'b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '9e2017d8-615c-4ee6-9036-26c9e3027ef6', false),

                -- International School of Languages (ISL)
                ('d0e1f2a3-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Italian Cooking & Language',
                 'Learn Italian while mastering culinary skills.',
                 'Cooking classes, language lessons, recipe translation',
                 '12 weeks', 1700.00, 85.00, true,
                 '660e8400-e29b-41d4-a716-446655440002', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452', false),
                ('e1f2a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'Japanese Advanced',
                 'Take your Japanese to the next level.',
                 'Kanji study, advanced grammar, discussion',
                 '14 weeks', 1900.00, 95.00, true,
                 '660e8400-e29b-41d4-a716-446655440003', '0ab6ef6f-bd0e-4a0a-a5a2-6b8e31c1e452', false),

                -- Middle-sex University Malta (MSUM)
                ('f2a3b4c5-6d7e-8f9a-0b1c-2d3e4f5a6b7c', 'English IELTS Prep',
                 'Get ready for the IELTS exam with expert guidance.',
                 'Mock tests, writing practice, speaking drills',
                 '10 weeks', 1600.00, 70.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174000', false),
                ('a3b4c5d6-7e8f-9a0b-1c2d-3e4f5a6b7c8d', 'French for Tourism',
                 'Learn French for travel and hospitality.',
                 'Tourist phrases, role-playing, cultural insights',
                 '8 weeks', 1200.00, 50.00, true,
                 'c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174000', false),

                -- Cosmopolitan School of Languages (CSOL)
                ('b4c5d6e7-8f9a-0b1c-2d3e-4f5a6b7c8d9e', 'German Beginners',
                 'Start your German journey with this foundational course.',
                 'Basic grammar, vocabulary, pronunciation',
                 '6 weeks', 1000.00, 40.00, true,
                 '770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174100', true),
                ('c5d6e7f8-9a0b-1c2d-3e4f-5a6b7c8d9e0f', 'Italian Intermediate',
                 'Advance your Italian skills with confidence.',
                 'Conversation, grammar, listening practice',
                 '12 weeks', 1500.00, 75.00, true,
                 '660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174100', true),

                -- Language Excellence Academy (LEA)
                ('d6e7f8a9-0b1c-2d3e-4f5a-6b7c8d9e0f1a', 'Chinese for Business',
                 'Learn Chinese for professional opportunities.',
                 'Business terms, negotiation practice, cultural norms',
                 '14 weeks', 2000.00, 100.00, true,
                 '660e8400-e29b-41d4-a716-446655440001', '37b5d1b7-ec01-466d-837d-0098a175c250', true),
                ('e7f8a9b0-1c2d-3e4f-5a6b-7c8d9e0f1a2b', 'English Speaking Bootcamp',
                 'Boost your English fluency in a short time.',
                 'Intensive speaking, pronunciation, group activities',
                 '4 weeks', 900.00, 30.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '37b5d1b7-ec01-466d-837d-0098a175c250', true),

                -- London Language Institute (LEI)
                ('f8a9b0c1-2d3e-4f5a-6b7c-8d9e0f1a2b3c', 'French Advanced Literature',
                 'Explore French literature while improving your skills.',
                 'Reading classics, discussions, essay writing',
                 '16 weeks', 2200.00, 110.00, true,
                 'c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174001', true),
                ('a9b0c1d2-3e4f-5a6b-7c8d-9e0f1a2b3c4d', 'English Creative Writing',
                 'Unleash your creativity with this English course.',
                 'Writing workshops, storytelling, peer reviews',
                 '12 weeks', 1800.00, 90.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174001', true),

                -- Academic Language Center (ACLC)
                ('b0c1d2e3-4f5a-6b7c-8d9e-0f1a2b3c4d5e', 'Japanese Culture & Language',
                 'Combine language learning with cultural immersion.',
                 'Tea ceremonies, calligraphy, conversation',
                 '10 weeks', 1600.00, 80.00, true,
                 '660e8400-e29b-41d4-a716-446655440003', 'db1239a3-1d58-4430-9eaa-e29fe6dee5e4', true),
                ('c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'Spanish Intensive',
                 'Rapidly improve your Spanish proficiency.',
                 'Daily lessons, immersion activities, quizzes',
                 '8 weeks', 1400.00, 60.00, true,
                 'b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', 'db1239a3-1d58-4430-9eaa-e29fe6dee5e4', true),

                -- New York Language Center (NYLC)
                ('d2e3f4a5-6b7c-8d9e-0f1a-2b3c4d5e6f7a', 'English TOEFL Prep',
                 'Ace the TOEFL with this comprehensive course.',
                 'Practice tests, reading, speaking drills',
                 '12 weeks', 1700.00, 85.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174002', true),
                ('e3f4a5b6-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'Chinese Beginners',
                 'Start your Chinese journey with this course.',
                 'Pinyin, basic characters, speaking practice',
                 '10 weeks', 1300.00, 50.00, true,
                 '660e8400-e29b-41d4-a716-446655440001', '123e4567-e89b-12d3-a456-426614174002', true),

                -- Madrid Language School (MSS)
                ('f4a5b6c7-8d9e-0f1a-2b3c-4d5e6f7a8b9c', 'Spanish Advanced Grammar',
                 'Perfect your Spanish with advanced grammar.',
                 'Subjunctive mood, complex sentences, writing',
                 '14 weeks', 1900.00, 95.00, true,
                 'b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174003', true),
                ('a5b6c7d8-9e0f-1a2b-3c4d-5e6f7a8b9c0d', 'Portuguese for Travelers',
                 'Learn Portuguese for your next adventure.',
                 'Travel phrases, pronunciation, cultural tips',
                 '6 weeks', 900.00, 40.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0d4e5a7d9b', '123e4567-e89b-12d3-a456-426614174003', true),

                -- Dubai Language Hub (DLH)
                ('b6c7d8e9-0f1a-2b3c-4d5e-6f7a8b9c0d1e', 'English for Professionals',
                 'Enhance your career with business English.',
                 'Meetings, presentations, networking skills',
                 '12 weeks', 1800.00, 90.00, true,
                 '8a4f2d1b-3e5c-4a7d-9b2e-1c0f3e5a7d9b', '123e4567-e89b-12d3-a456-426614174006', true),
                ('c7d8e9f0-1a2b-3c4d-5e6f-7a8b9c0d1e2f', 'Japanese Business Etiquette',
                 'Master Japanese for business contexts.',
                 'Keigo, bowing, business card exchange',
                 '10 weeks', 1700.00, 85.00, true,
                 '660e8400-e29b-41d4-a716-446655440003', '123e4567-e89b-12d3-a456-426614174006', true),

                -- Paris French Academy (PFA)
                ('d8e9f0a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a', 'French DELF B2 Prep',
                 'Prepare for the DELF B2 exam with ease.',
                 'Mock exams, writing, speaking practice',
                 '14 weeks', 2000.00, 100.00, true,
                 'c3d8f6e1-2a9b-4f5c-7e0d-9b1a3f6c8e2d', '123e4567-e89b-12d3-a456-426614174004', true),
                ('e9f0a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b', 'Spanish Beginners',
                 'Start learning Spanish from scratch.',
                 'Basic grammar, vocabulary, pronunciation',
                 '8 weeks', 1200.00, 50.00, true,
                 'b7e2c9a4-5f1d-4e3b-8a6c-2d9f0e4b7c1a', '123e4567-e89b-12d3-a456-426614174004', true),

                -- Berlin Language Institute (BGI)
                ('f0a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c', 'German Goethe B1 Prep',
                 'Get ready for the Goethe B1 certification.',
                 'Exam practice, listening, writing skills',
                 '12 weeks', 1800.00, 90.00, true,
                 '770e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005', true),
                ('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6e', 'Italian for Opera Lovers',
                 'Learn Italian through the lens of opera.',
                 'Libretto reading, singing, language lessons',
                 '10 weeks', 1600.00, 80.00, true,
                 '660e8400-e29b-41d4-a716-446655440002', '123e4567-e89b-12d3-a456-426614174005', true);
        END IF;
    END
$$;