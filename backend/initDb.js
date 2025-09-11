const fs = require("fs");
const pgPool = require("./db_config/postgresConnection");

const schema = fs.readFileSync("./schema.sql", "utf-8");
pgPool
  .query(schema)
  .then(() => {
    console.log("Schema created successfully.");
    process.exit();
  })
  .catch((error) => {
    console.log("error creating schema", error);
    process.exit(1);
  });
