const pgPool = require("../db_config/postgresConnection");

const createTask = async (title, description, status, deadline, userid) => {
  const result = await pgPool.query(
    `INSERT INTO tasks(title, description, status, deadline, userid) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, status, deadline, userid]
  );
  return result.rows[0];
};

const findTasks = async (userid) => {
  const result = await pgPool.query(`SELECT * FROM tasks WHERE userid = $1`, [
    userid,
  ]);
  return result.rows;
};

const getTaskById = async (id, userid) => {
  const result = await pgPool.query(
    `SELECT * FROM tasks where id=$1 and userid=$2`,
    [id, userid]
  );
  return result.rows[0];
};

const deleteTask = async (id, userid) => {
  const result = await pgPool.query(
    `DELETE FROM tasks WHERE id = $1 AND userid = $2 RETURNING *`,
    [id, userid]
  );
  return result.rows[0];
};

const updateTask = async (title, description, status, deadline, userid, id) => {
  const result = await pgPool.query(
    `UPDATE tasks SET title = $1, description = $2, status = $3, deadline = $4, updatedat = NOW() where id = $5 AND userid = $6 RETURNING *`,
    [title, description, status, deadline, id, userid]
  );
  return result.rows[0];
};

module.exports = { createTask, findTasks, deleteTask, getTaskById, updateTask };
