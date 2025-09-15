const supabase = require("../db_config/postgresConnection");

const createUser = async (name, email, hashedPassword) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
};

const findUser = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
};

module.exports = { createUser, findUser };
