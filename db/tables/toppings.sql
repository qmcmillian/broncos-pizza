CREATE TABLE IF NOT EXISTS toppings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO toppings (name) VALUES 
    ('Cheese'),
    ('Pepperoni'),
    ('Mushrooms'),
    ('Olives'),
    ('Bacon'),
    ('Onions')
ON CONFLICT (name) DO NOTHING;