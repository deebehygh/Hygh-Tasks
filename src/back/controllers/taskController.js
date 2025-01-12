const { addTaskToRedis, getAllTasksFromRedis, updateTaskInRedis, deleteTaskFromRedis } = require("../models/taskModel");
const { getIO } = require("../socket");
const { scheduleReminder } = require("../utils/scheduleReminder");

exports.getAllTasks = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const tasks = await getAllTasksFromRedis(categoryId);
    const io = getIO();
    io.emit("fetchTasks", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
};

// Add a new task
exports.addTask = async (req, res) => {
  const { title, deadline, status, category, tags, reminder } = req.body;

  if (!title || !deadline) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const task = await addTaskToRedis({
      title,
      startDate: new Date().toISOString(),
      deadline,
      status: status || "Pending",
      category,
    });


    const io = getIO();
    io.emit("taskAdded", task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: `Failed to add task: ${error}` });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, deadline, tags, reminder, } = req.body;

  try {
    const updatedTask = await updateTaskInRedis(id, title, deadline, tags, reminder);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTaskFromRedis(id);
    const io = getIO();
    io.emit("taskDeleted", id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
