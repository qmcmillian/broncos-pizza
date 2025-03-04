const path = require("path");
const fs = require("fs");
const pool = require("./connection");

const sqlFiles = [
  "sizes.sql",
  "sauces.sql",
  "toppings.sql",
  "pizzas.sql",
  "pizza_toppings.sql",
];

async function initializeTables() {
  try {
    for (let file of sqlFiles) {
      const filePath = path.join(__dirname, "tables", file);

      if (!fs.existsSync(filePath)) {
        console.error(`ERROR: SQL file missing: ${filePath}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, "utf8");

      try {
        await pool.query(sql);
      } catch (queryError) {
        console.error(`Error executing ${file}:`, queryError);
        process.exit(1);
      }
    }
    console.log("Tables initialized successfully.");
  } catch (err) {
    console.error("There was an error while initializing tables:", err);
    process.exit(1); 
  } finally {
  }
}

module.exports = initializeTables;