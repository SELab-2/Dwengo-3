DROP DATABASE dwengo_db;
CREATE DATABASE dwengo_db;
CREATE TABLE IF NOT EXISTS learning_objects (
    hruid TEXT UNIQUE NOT NULL,
    uuid TEXT UNIQUE NOT NULL,
    _id TEXT PRIMARY KEY,
    version INT NOT NULL,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT CHECK (
        content_type IN (
            'text/plain',
            'text/markdown',
            'image/image-block',
            'image/image',
            'audio/mpeg',
            'application/pdf',
            'extern',
            'blockly'
        )
    ),
    target_ages INT [],
    teacher_exclusive BOOLEAN DEFAULT FALSE,
    skos_concepts TEXT [],
    educational_goals JSON [],
    copyright TEXT,
    licence TEXT,
    difficulty NUMERIC CHECK (
        difficulty BETWEEN 1 AND 5
    ),
    estimated_time NUMERIC,
    return_value JSON,
    available BOOLEAN DEFAULT TRUE,
    content_location TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
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
    FOREIGN KEY (lp_id) REFERENCES learning_paths(_id) FOREIGN KEY (lo_hruid) REFERENCES learning_objects(hruid)
);
CREATE TABLE IF NOT EXISTS learning_path_transitions (
    _id TEXT PRIMARY KEY,
    from_node_id INT NOT NULL,
    to_learningobject_hruid TEXT NOT NULL,
    to_version INT NOT NULL,
    to_language TEXT NOT NULL,
    condition TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (from_node_id) REFERENCES learning_path_nodes(_id) ON DELETE CASCADE,
    FOREIGN KEY (to_learningobject_hruid) REFERENCES learning_objects(hruid) ON DELETE CASCADE
);