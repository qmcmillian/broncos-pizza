const { Pool } = require("pg");

const pool = new Pool({
  user: "t4_admin",
  host: "localhost",
  database: "broncos_pizza_db",
  password: "transport4",
  port: 5433,
});

module.exports = pool;