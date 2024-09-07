CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    confirmed SMALLINT DEFAULT 0, 
    -- 0 not confirmed at all, 1 confirmed by email, 2 confirmed by sandbox
    password VARCHAR NOT NULL,
    role SMALLINT DEFAULT 0
);
CREATE TABLE mail_service
(
    id SERIAL PRIMARY KEY,
    user_id INT references users(id),
    type VARCHAR,
    token UUID default gen_random_uuid(),
    createdat timestamp DEFAULT CURRENT_TIMESTAMP,
);

CREATE USER service WITH PASSWORD 'mdp2';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service;