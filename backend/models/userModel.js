const pgPool = require("../db_config/postgresConnection");

const createUser = async (name, email, hashedPassword) => {
  const result = await pgPool.query(
    `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

const findUser = async (email) => {
  const result = await pgPool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return result.rows[0];
};

module.exports = { createUser, findUser };
