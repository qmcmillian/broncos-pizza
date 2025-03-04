const pool = require("../db/connection");

// Fetch valid choices for sizes, sauces, and toppings
const getValidChoices = async () => {
  const sizes = await pool.query("SELECT name FROM sizes");
  const sauces = await pool.query("SELECT name FROM sauces");
  const toppings = await pool.query("SELECT name FROM toppings");

  return {
    sizes: sizes.rows.map(row => row.name),
    sauces: sauces.rows.map(row => row.name),
    toppings: toppings.rows.map(row => row.name),
  };
};

const validatePizzaCreate = async (req, res, next) => {
  const { size, sauce, toppings } = req.body;

  // Ensure all required fields are provided
  if (!size || !sauce || !Array.isArray(toppings) || toppings.length === 0) {
    return res.status(400).json({ error: "Size, sauce, and at least one topping must be provided." });
  }

  try {
    const validChoices = await getValidChoices();

    // Validate size, sauce, and toppings
    if (!validChoices.sizes.includes(size)) {
      return res.status(400).json({ error: `The size you have selected is either invalid or out of stock: '${size}'. Choose from: ${validChoices.sizes.join(", ")}` });
    }
    if (!validChoices.sauces.includes(sauce)) {
      return res.status(400).json({ error: `The sauce you have selected is either invalid or out of stock: '${sauce}'. Choose from: ${validChoices.sauces.join(", ")}` });
    }
    for (const topping of toppings) {
      if (!validChoices.toppings.includes(topping)) {
        return res.status(400).json({ error: `The topping you have selected is either invalid or out of stock: '${topping}'. Choose from: ${validChoices.toppings.join(", ")}` });
      }
    }

    next();
  } catch (error) {
    console.error("Error validating pizza creation:", error);
    res.status(500).json({ error: "Internal server error during validation." });
  }
};

const validatePizzaUpdate = async (req, res, next) => {
  const pizzaId = req.params.id;
  const { size, sauce, toppings } = req.body;

  // Ensure at least one field is provided
  if (!size && !sauce && (!Array.isArray(toppings) || toppings.length === 0)) {
    return res.status(400).json({ error: "At least one field (size, sauce, or toppings) must be provided for update." });
  }

  try {
    // Check if the pizza exists
    const pizzaCheck = await pool.query("SELECT id FROM pizzas WHERE id = $1", [pizzaId]);
    if (pizzaCheck.rows.length === 0) {
      return res.status(404).json({ error: `Pizza with id ${pizzaId} not found.` });
    }

    const validChoices = await getValidChoices();

    // Validate provided updates
    if (size && !validChoices.sizes.includes(size)) {
      return res.status(400).json({ error: `The size you have selected is either invalid or out of stock: '${size}'. Choose from: ${validChoices.sizes.join(", ")}` });
    }
    if (sauce && !validChoices.sauces.includes(sauce)) {
      return res.status(400).json({ error: `The sauce you have selected is either invalid or out of stock: '${sauce}'. Choose from: ${validChoices.sauces.join(", ")}` });
    }
    if (Array.isArray(toppings) && toppings.length > 0) {
      for (const topping of toppings) {
        if (!validChoices.toppings.includes(topping)) {
          return res.status(400).json({ error: `The topping you have selected is either invalid or out of stock: '${topping}'. Choose from: ${validChoices.toppings.join(", ")}` });
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error validating pizza update:", error);
    res.status(500).json({ error: "Internal server error during validation." });
  }
};

module.exports = { validatePizzaCreate, validatePizzaUpdate };