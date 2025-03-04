const express = require("express");
const router = express.Router();
const pizzaService = require("../services/pizzaService");
const { validatePizzaCreate, validatePizzaUpdate } = require("../middlewares/validatePizza");

// Get Pizza Sizes
router.get("/sizes", async (req, res) => {
  try {
    const sizes = await pizzaService.getAllFromTable("sizes");

    if (sizes.length === 0) {
      return res.status(404).json({ error: "No sizes available" });
    }

    res.status(200).json(sizes.map(size => size.name));
  } catch (error) {
    console.error("Error fetching sizes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Sauces
router.get("/sauces", async (req, res) => {
  try {
    const sauces = await pizzaService.getAllFromTable("sauces");

    if (sauces.length === 0) {
      return res.status(404).json({ error: "No sauces available" });
    }

    res.status(200).json(sauces.map(sauce => sauce.name));
  } catch (error) {
    console.error("Error fetching sauces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Toppings
router.get("/toppings", async (req, res) => {
  try {
    const toppings = await pizzaService.getAllFromTable("toppings");

    if (toppings.length === 0) {
      return res.status(404).json({ error: "No toppings available" });
    }

    res.status(200).json(toppings.map(topping => topping.name));
  } catch (error) {
    console.error("Error fetching toppings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create Pizza
router.post("/", validatePizzaCreate, async (req, res) => {
  const { size, sauce, toppings } = req.body;

  try {
    const result = await pizzaService.createPizza(size, sauce, toppings);
    res.status(201).json({ message: "Pizza created successfully!", ...result });
  } catch (error) {
    console.error("Error creating pizza:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get Pizza from DB
router.get("/:id", async (req, res) => {
  const pizzaId = req.params.id;

  try {
    const result = await pizzaService.getPizzaById(pizzaId);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("not found")) {
      console.log(`Pizza ${pizzaId} not found (expected).`);
    } else {
      console.error(`Unexpected error fetching pizza by id ${pizzaId}:`, error);
    }
    res.status(404).json({ error: "Pizza not found" });
  }
});

// Update Pizza
router.put("/:id", validatePizzaUpdate, async (req, res) => {
  const pizzaId = req.params.id;
  const { size, sauce, toppings } = req.body;

  try {
    const result = await pizzaService.updatePizza(pizzaId, size, sauce, toppings);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error updating pizza with ID ${pizzaId}:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete Pizza from DB
router.delete("/:id", async (req, res) => {
  const pizzaId = req.params.id;

  try {
    const result = await pizzaService.deletePizza(pizzaId);
    res.status(200).json(result);
  } catch (error) {
    console.error(`Error deleting pizza with ID ${pizzaId}:`, error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;