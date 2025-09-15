const taskModel = require("../models/taskModel");

const createTask = async (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;
    const userId = req.user.userid;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newTask = await taskModel.createTask(
      title,
      description,
      status || "pending",
      deadline,
      userId
    );

    res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (err) {
    console.error("Error creating task:", err.message || err);
    res.status(500).json({ message: "Failed to create task." });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.userid;
    const tasks = await taskModel.findTasks(userId);
    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message || err);
    res.status(500).json({ message: "Failed to fetch tasks." });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userid;
    const task = await taskModel.getTaskById(id, userId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err.message || err);
    res.status(500).json({ message: "Failed to fetch task." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userid;
    const { title, description, status, deadline } = req.body;

    const updatedTask = await taskModel.updateTask(
      title,
      description,
      status,
      deadline,
      userId,
      id
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized." });
    }

    res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Error updating task:", err.message || err);
    res.status(500).json({ message: "Failed to update task." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userid;

    const deletedTask = await taskModel.deleteTask(id, userId);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized." });
    }

    res.status(200).json({
      message: "Task deleted successfully.",
      task: deletedTask,
    });
  } catch (err) {
    console.error("Error deleting task:", err.message || err);
    res.status(500).json({ message: "Failed to delete task." });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
};
