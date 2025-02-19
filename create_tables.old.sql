CREATE TYPE content_type_enum AS ENUM (
            'text/plain',
            'text/markdown',
            'image/image-block',
            'image/image',
            'audio/mpeg',
            'application/pdf',
            'extern',
            'blockly'
);

CREATE TABLE IF NOT EXISTS learning_objects (
    hruid TEXT UNIQUE NOT NULL,
    uuid TEXT UNIQUE NOT NULL,
    _id TEXT PRIMARY KEY,
    version INT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type_enum,
    target_ages INT [],
    teacher_exclusive BOOLEAN DEFAULT FALSE,
    skos_concepts TEXT [],
    educational_goals JSON [],
    copyright TEXT,
    licence TEXT,
    difficulty NUMERIC,
    estimated_time NUMERIC,
    return_value JSON,
    available BOOLEAN DEFAULT TRUE,
    content_location TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_difficulty CHECK (difficulty >= 1 AND difficulty <= 5)
);
CREATE TABLE IF NOT EXISTS learning_objects_keyword (
    lo_id TEXT PRIMARY KEY,
    keyword TEXT NOT NULL,
    UNIQUE (lo_id, keyword),
    FOREIGN KEY (lo_id) REFERENCES learning_objects(_id)
);
CREATE TABLE IF NOT EXISTS learning_paths (
    _id TEXT PRIMARY KEY,
    hruid TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    -- Base64 representation
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS learning_path_nodes (
    _id TEXT PRIMARY KEY,
    lp_id TEXT NOT NULL,
    lo_hruid TEXT NOT NULL,
    version INT NOT NULL,
    language TEXT NOT NULL,
    instruction TEXT,
    start_node BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (lp_id) REFERENCES learning_paths(_id),
    FOREIGN KEY (lo_hruid) REFERENCES learning_objects(hruid)
);
CREATE TABLE IF NOT EXISTS learning_path_transitions (
    _id TEXT PRIMARY KEY,
    from_node_id TEXT NOT NULL,
    to_lo_hruid TEXT NOT NULL,
    to_version INT NOT NULL,
    to_language TEXT NOT NULL,
    condition TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (from_node_id) REFERENCES learning_path_nodes(_id),
    FOREIGN KEY (to_lo_hruid) REFERENCES learning_objects(hruid)
);
