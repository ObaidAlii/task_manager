const supabase = require("../db_config/postgresConnection");

const createUser = async (name, email, hashedPassword) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const findUser = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
};

module.exports = { createUser, findUser };
