CREATE TABLE
    IF NOT EXISTS _core_workspace_config (
        id SERIAL PRIMARY KEY,
        owner_id VARCHAR(255),
        database_config JSONB,
        plugin_config JSONB,
        genneral_config JSONB,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );
