// const { Pool } = require("pg");
// require("dotenv").config();

// // const pgPool = new Pool({
// //   user: process.env.DBUSER,
// //   host: process.env.DBHOST,
// //   password: process.env.DBPASSWORD,
// //   database: process.env.DBNAME,
// //   port: process.env.DBPORT,
// // });
// const pgPool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// module.exports = pgPool;

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
