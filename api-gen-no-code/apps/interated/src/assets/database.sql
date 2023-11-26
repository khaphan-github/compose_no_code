CREATE TABLE
    IF NOT EXISTS study_class (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255),
        name VARCHAR(255),
        session VARCHAR(255),
        owner_id INT4,
        metadata JSONB,
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW(),
        updated_at timestamp(0) without time zone DEFAULT NOW()
    );

CREATE TABLE
    IF NOT EXISTS student_in_class (
        id SERIAL PRIMARY KEY,
        class_id INT4,
        student_id INT4,
        metadata JSONB,
        enable BOOLEAN,
        created_at timestamp(0) without time zone DEFAULT NOW()
    );

CREATE TABLE
    IF NOT EXISTS class_check_in (
        id SERIAL PRIMARY KEY,
        class_id INT4,
        begin_at DATE,
        end_at DATE,
        metadata JSONB,
        created_at timestamp(0) without time zone DEFAULT NOW()
    );

CREATE TABLE
    IF NOT EXISTS student_checked_in_class (
        id SERIAL PRIMARY KEY,
        class_id INT4,
        student_id INT4,
        metadata JSONB,
        checked_in_date timestamp(0) without time zone DEFAULT NOW()
    );
