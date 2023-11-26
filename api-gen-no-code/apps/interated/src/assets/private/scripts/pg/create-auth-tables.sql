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

INSERT INTO
    _core_role (
        id,
        display_name,
        description,
        metadata,
        enable
    )
VALUES (
        1,
        'Administrator',
        'Administrator Role',
        '{"allowAllAPI": "true"}',
        true
    ), (
        2,
        'Public',
        'Những api không cần đăng nhập mới truy cập được',
        '{"defaultWhenRegister": "true"}',
        true
    )
