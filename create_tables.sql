CREATE DATABASE dwengo-groep3;

CREATE TABLE IF NOT EXISTS learning_objects (
    hruid TEXT UNIQUE NOT NULL,                                 -- Human-readable unique ID
    uuid TEXT UNIQUE NOT NULL,                                  -- Numerical equivalent of hruid
    _id TEXT PRIMARY KEY,                                       -- Unique ID
    version INT NOT NULL,                                       -- Version, unique with hruid/uuid + language
    language TEXT NOT NULL,                                     -- Language of the learning object
    title TEXT NOT NULL,                                        -- Short description
    description TEXT,                                           -- Long description
    content_type TEXT CHECK (content_type IN (
        'text/plain', 'text/markdown', 'image/image-block',
        'image/image', 'audio/mpeg', 'application/pdf', 'extern',
        'blockly'
    )),                                                         -- Type of content
    keywords TEXT[],                                            -- Array of keywords
    target_ages INT[],                                          -- Array of target ages
    teacher_exclusive BOOLEAN DEFAULT FALSE,                    -- If it's exclusive for teachers
    skos_concepts TEXT[],                                       -- Array of SKOS concept URIs
    educational_goals JSON[],                                   -- JSON object for educational goals
    copyright TEXT,                                             -- Copyright information
    licence TEXT,                                               -- Licence information
    difficulty NUMERIC CHECK (difficulty BETWEEN 1 AND 5),      -- Difficulty scale (1-5)
    estimated_time NUMERIC,                                     -- Estimated time in minutes
    return_value JSON,                                          -- JSON object for return value (callback URL + schema)
    available BOOLEAN DEFAULT TRUE,                             -- Availability flag
    content_location TEXT                                       -- External content location if applicable
    created_at TIMESTAMP DEFAULT NOW(),                         -- Timestamp when created
    updated_at TIMESTAMP DEFAULT NOW(),                         -- Timestamp when last updated
);
