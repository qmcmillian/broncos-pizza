CREATE TABLE IF NOT EXISTS sauces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO sauces (name) VALUES 
    ('Tomato'),
    ('Pesto'),
    ('BBQ')
ON CONFLICT (name) DO NOTHING;