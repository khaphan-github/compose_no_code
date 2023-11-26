CREATE TABLE
    IF NOT EXISTS _core_generated_apis (
        id SERIAL PRIMARY KEY,
        app_id INTEGER,
        table_name VARCHAR(255),
        action VARCHAR(155),
        api_path VARCHAR(155),
        http_method VARCHAR(10),
        authentication VARCHAR(155),
        api_authorized JSONB,
        headers JSONB,
        request_params JSONB,
        request_body_type VARCHAR(155),
        request_body JSONB,
        response_attributes JSONB,
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );
