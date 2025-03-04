CREATE TABLE IF NOT EXISTS sizes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO sizes (name) VALUES 
    ('Small'),
    ('Medium'),
    ('Large')
ON CONFLICT (name) DO NOTHING;