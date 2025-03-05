const request = require("supertest");
const { app } = require("../index");
const pool = require("../db/connection");
const initializeTables = require("../db/initTables");

let server;
let pizzaId1;
let pizzaId2;

describe("E2E Tests for Broncos Pizza API", () => {
  beforeAll(async () => {
    server = app.listen(0, () => {
      const port = server.address().port;
    });
    await initializeTables();
    await pool.query(
      "TRUNCATE TABLE pizza_toppings, pizzas RESTART IDENTITY CASCADE"
    );
    console.log("Database reset and ready.");
  });

  afterAll(async () => {
    await server.close();
    await pool.query(
      "TRUNCATE TABLE pizza_toppings, pizzas RESTART IDENTITY CASCADE"
    );
    console.log("Test suite complete. Database reset.");
    await pool.end();
  });

  describe("Get Endpoints", () => {
    test("Should return all pizza sizes from database when pinging sizes endpoint", async () => {
      const response = await request(server).get("/pizzas/sizes");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining(["Small", "Medium", "Large"])
      );
    });

    test("Should return all pizza sauces from database when pinging sauces endpoint", async () => {
      const response = await request(server).get("/pizzas/sauces");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining(["Pesto", "Tomato", "BBQ"])
      );
    });

    test("Should return all pizza toppings from database when pinging toppings endpoint", async () => {
      const expectedResponse = [
        "Pepperoni",
        "Olives",
        "Cheese",
        "Onions",
        "Mushrooms",
        "Bacon",
      ];

      const response = await request(server).get("/pizzas/toppings");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining(expectedResponse));
    });
  });

  describe("Create", () => {
    test("Should successfully create first pizza", async () => {
      const response = await request(server)
        .post("/pizzas")
        .send({
          size: "Large",
          sauce: "Tomato",
          toppings: ["Cheese", "Pepperoni"],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("pizzaId");
      pizzaId1 = response.body.pizzaId;
    });

    test("Should successfully create second pizza", async () => {
      const response = await request(server)
        .post("/pizzas")
        .send({
          size: "Medium",
          sauce: "Pesto",
          toppings: ["Mushrooms", "Onions"],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("pizzaId");
      pizzaId2 = response.body.pizzaId;
    });
  });

  describe("Read", () => {
    test("Should successfully fetch first pizza", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId1}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        pizza_id: pizzaId1,
        size: "Large",
        sauce: "Tomato",
        toppings: expect.arrayContaining(["Cheese", "Pepperoni"]),
      });
    });

    test("Should successfully fetch second pizza", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId2}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        pizza_id: pizzaId2,
        size: "Medium",
        sauce: "Pesto",
        toppings: expect.arrayContaining(["Mushrooms", "Onions"]),
      });
    });
  });

  describe("Update", () => {
    test("Should update first pizza", async () => {
      const response = await request(server)
        .put(`/pizzas/${pizzaId1}`)
        .send({
          size: "Medium",
          sauce: "BBQ",
          toppings: ["Bacon", "Onions"],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Pizza updated successfully!"
      );
    });

    test("Should update second pizza", async () => {
      const response = await request(server)
        .put(`/pizzas/${pizzaId2}`)
        .send({
          size: "Small",
          sauce: "Tomato",
          toppings: ["Cheese", "Olives"],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Pizza updated successfully!"
      );
    });

    test("Should verify first pizza update", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId1}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        pizza_id: pizzaId1,
        size: "Medium",
        sauce: "BBQ",
        toppings: expect.arrayContaining(["Bacon", "Onions"]),
      });
    });

    test("Should verify second pizza update", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId2}`);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        pizza_id: pizzaId2,
        size: "Small",
        sauce: "Tomato",
        toppings: expect.arrayContaining(["Cheese", "Olives"]),
      });
    });
  });

  describe("Delete", () => {
    test("Should delete first pizza", async () => {
      const response = await request(server).delete(`/pizzas/${pizzaId1}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toContain("deleted successfully");
    });

    test("Should delete second pizza", async () => {
      const response = await request(server).delete(`/pizzas/${pizzaId2}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toContain("deleted successfully");
    });

    test("Should confirm first pizza no longer exists", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId1}`);
      expect(response.status).toBe(404);
    });

    test("Should confirm second pizza no longer exists", async () => {
      const response = await request(server).get(`/pizzas/${pizzaId2}`);
      expect(response.status).toBe(404);
    });
  });
});
