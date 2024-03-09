CREATE TABLE
    IF NOT EXISTS _core_applications (
        id SERIAL PRIMARY KEY,
        owner_id VARCHAR(255),
        workspace_id INTEGER,
        app_name VARCHAR(255),
        tables_info JSONB,
        create_db_script VARCHAR,
        create_db_ui JSONB,
        database_config JSONB,
        use_default_db BOOLEAN,
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );