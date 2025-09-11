const { Pool } = require("pg");
require("dotenv").config();

const pgPool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  port: process.env.DBPORT,
});

module.exports = pgPool;
