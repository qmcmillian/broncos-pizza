CREATE TABLE IF NOT EXISTS pizza_toppings (
    pizza_id INT NOT NULL,
    topping_id INT NOT NULL,
    PRIMARY KEY (pizza_id, topping_id),
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE,
    FOREIGN KEY (topping_id) REFERENCES toppings(id) ON DELETE CASCADE
);