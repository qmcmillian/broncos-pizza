CREATE TABLE IF NOT EXISTS pizzas (
    id SERIAL PRIMARY KEY,
    size_id INT NOT NULL,
    sauce_id INT NOT NULL,
    FOREIGN KEY (size_id) REFERENCES sizes(id),
    FOREIGN KEY (sauce_id) REFERENCES sauces(id)
);