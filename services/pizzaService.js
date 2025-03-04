const pool = require("../db/connection");

// Helper Methods
const getIdByName = async (table, name) => {
  const result = await pool.query(`SELECT id FROM ${table} WHERE name = $1`, [name]);
  if (result.rows.length === 0) {
    throw new Error(`Invalid ${table} name: ${name}`);
  }
  return result.rows[0].id;
};

const getAllFromTable = async (table) => {
  try {
    const validTables = ["sizes", "sauces", "toppings"];
    if (!validTables.includes(table)) {
      throw new Error(`Invalid table name: ${table}`);
    }

    const result = await pool.query(`SELECT * FROM ${table}`);
    return result.rows;
  } catch (error) {
    console.error(`Error fetching from ${table}:`, error);
    throw error;
  }
};

// DB Methods
const getPizzaById = async (pizzaId) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.id AS pizza_id, 
        s.name AS size, 
        sa.name AS sauce,
        ARRAY_AGG(t.name) AS toppings
      FROM pizzas p
      JOIN sizes s ON p.size_id = s.id
      JOIN sauces sa ON p.sauce_id = sa.id
      LEFT JOIN pizza_toppings pt ON p.id = pt.pizza_id
      LEFT JOIN toppings t ON pt.topping_id = t.id
      WHERE p.id = $1
      GROUP BY p.id, s.name, sa.name;
      `,
      [pizzaId]
    );

    if (result.rows.length === 0) {
      throw new Error(`Pizza with id ${pizzaId} not found`);
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching pizza by ID:", error);
    throw error;
  }
};

const createPizza = async (size, sauceName, toppingNames) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const sizeId = await getIdByName("sizes", size);
    const sauceId = await getIdByName("sauces", sauceName);
    
    const toppingIds = [];
    for (const topping of toppingNames) {
      const toppingId = await getIdByName("toppings", topping);
      toppingIds.push(toppingId);
    }

    const pizzaResult = await client.query(
      "INSERT INTO pizzas (size_id, sauce_id) VALUES ($1, $2) RETURNING id",
      [sizeId, sauceId]
    );
    const pizzaId = pizzaResult.rows[0].id;

    for (const toppingId of toppingIds) {
      await client.query(
        "INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES ($1, $2)",
        [pizzaId, toppingId]
      );
    }

    await client.query("COMMIT");
    return { pizzaId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const updatePizza = async (pizzaId, newSize, newSauce, newToppings) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (newSize) {
      const sizeId = await getIdByName("sizes", newSize);
      await client.query("UPDATE pizzas SET size_id = $1 WHERE id = $2", [sizeId, pizzaId]);
    }

    if (newSauce) {
      const sauceId = await getIdByName("sauces", newSauce);
      await client.query("UPDATE pizzas SET sauce_id = $1 WHERE id = $2", [sauceId, pizzaId]);
    }

    if (newToppings && newToppings.length > 0) {
      await client.query("DELETE FROM pizza_toppings WHERE pizza_id = $1", [pizzaId]);

      const toppingIds = await Promise.all(newToppings.map(name => getIdByName("toppings", name)));
      for (const toppingId of toppingIds) {
        await client.query(
          "INSERT INTO pizza_toppings (pizza_id, topping_id) VALUES ($1, $2)",
          [pizzaId, toppingId]
        );
      }
    }

    await client.query("COMMIT");
    return { message: "Pizza updated successfully!", pizzaId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deletePizza = async (pizzaId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query("DELETE FROM pizzas WHERE id = $1 RETURNING id", [pizzaId]);

    if (result.rowCount === 0) {
      throw new Error(`Pizza with id ${pizzaId} not found`);
    }

    await client.query("COMMIT");
    return { message: `Pizza ${pizzaId} deleted successfully` };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { getAllFromTable, getPizzaById, createPizza, updatePizza, deletePizza };