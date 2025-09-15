const supabase = require("../db_config/postgresConnection");

const createTask = async (title, description, status, deadline, userid) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ title, description, status, deadline, userid }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const findTasks = async (userid) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("userid", userid);

  if (error) throw error;
  return data;
};

const getTaskById = async (id, userid) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("userid", userid)
    .single();

  if (error) throw error;
  return data;
};

const deleteTask = async (id, userid) => {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("userid", userid)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const updateTask = async (title, description, status, deadline, userid, id) => {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      status,
      deadline,
      updatedat: new Date(),
    })
    .eq("id", id)
    .eq("userid", userid)
    .select()
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  createTask,
  findTasks,
  getTaskById,
  deleteTask,
  updateTask,
};
