const express = require("express");
const initializeTables = require("./db/initTables");
const pizzaRoutes = require("./routes/pizzaRoutes");

const app = express();
app.use(express.json());
app.use("/pizzas", pizzaRoutes);

const PORT = process.env.PORT || 3000;
let server = null;

if (require.main === module) {
  console.log("Initializing database...");

  initializeTables()
    .then(() => {
      console.log("Database initialized successfully.");

      server = app.listen(PORT, () => {
        console.log(`Broncos Pizza API running on port ${PORT}`);
      });
      server.on("error", (err) => {
        console.error("Server failed to start:", err);
        process.exit(1);
      });
    })
    .catch((error) => {
      console.error("Failed to initialize database:", error);
      process.exit(1);
    });
}

module.exports = { app };
