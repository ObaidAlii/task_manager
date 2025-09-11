const { Pool } = require("pg");
require("dotenv").config();

// const pgPool = new Pool({
//   user: process.env.DBUSER,
//   host: process.env.DBHOST,
//   password: process.env.DBPASSWORD,
//   database: process.env.DBNAME,
//   port: process.env.DBPORT,
// });
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pgPool;
