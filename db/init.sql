
CREATE TABLE users
(
    id SERIAL,
    email VARCHAR UNIQUE,
    confirmed SMALLINT DEFAULT 0, 
    -- 0 not confirmed at all, 1 confirmed by sandbox, 2 confirmed by email
    password VARCHAR NOT NULL,
    role SMALLINT DEFAULT 0
);
CREATE USER service WITH PASSWORD 'mdp2';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service;