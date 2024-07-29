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

CREATE TABLE
    IF NOT EXISTS _core_account (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        metadata JSONB,
        enable BOOLEAN DEFAULT true,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );

CREATE TABLE
    IF NOT EXISTS _core_role (
        id SERIAL PRIMARY KEY,
        display_name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(255),
        metadata JSONB,
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );

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

CREATE TABLE
    IF NOT EXISTS _core_custom_api (
        id SERIAL PRIMARY KEY,
        action VARCHAR(155),
        api_path VARCHAR(155),
        http_method VARCHAR(10),
        authentication VARCHAR(155),
        availableColumns JSONB,
        metadata JSONB,
        code VARCHAR(512),
        queryString VARCHAR(512),
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );

CREATE TABLE IF NOT EXISTS _core_dynamic_menu (
    id SERIAL PRIMARY KEY, displayName VARCHAR(155), feRoute VARCHAR(155), icon VARCHAR(155), parentId INT, metadata JSONB, created_at timestamp(0) without time zone DEFAULT NOW(), updated_at timestamp(0) without time zone DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS _core_dynamic_form (
    id SERIAL PRIMARY KEY, action VARCHAR(155), title VARCHAR(155), fields JSONB, metadata JSONB, created_at timestamp(0) without time zone DEFAULT NOW(), updated_at timestamp(0) without time zone DEFAULT NOW()
);
