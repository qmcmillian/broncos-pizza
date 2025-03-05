const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "t4_admin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "broncos_pizza_db",
  password: process.env.DB_PASSWORD || "transport4",
  port: process.env.DB_PORT || 5433,
});

module.exports = pool;
