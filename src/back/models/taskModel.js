const redis = require("redis");
const { scheduleReminder } = require("../utils/scheduleReminder");
const { getCategoryById } = require("./categoryModel");
const client = redis.createClient();

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect();

// Generate a unique task ID
const generateTaskId = () => `task.${Date.now()}`;

// Add a task to Redis
exports.addTaskToRedis = async (taskData) => {
  try {
    let tasks = JSON.parse(await client.get("tasks")) || [];
    const id = generateTaskId();
    const task = { id, ...taskData };
    let categoryId = taskData.category.id;

    if (categoryId === 0 || categoryId === -1) {
      const defaultCategory = { id: 0, name: "Uncategorized" }; 
      task.category = defaultCategory;
      categoryId = defaultCategory.id;
    }

    const catData = await client.get("categories");
    if (!catData) {
      throw new Error("No categories found");
    }
    let categories = JSON.parse(catData);
    let catIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (catIndex === -1) {
      const newCategory = {
        id: categoryId,
        name: task.category.name || "Uncategorized",
        dateCreated: Date.now(),
        numberOfTasks: 1,
      };
      categories.push(newCategory);
      catIndex = categories.length - 1;
    } else {
      categories[catIndex].numberOfTasks =
        categories[catIndex].numberOfTasks === -1
          ? 1
          : categories[catIndex].numberOfTasks + 1;
    }

    tasks.push(task);
    await client.set("tasks", JSON.stringify(tasks));
    await client.set("categories", JSON.stringify(categories));

    return task;
  } catch (error) {
    console.error("Error adding task to Redis:", error);
    throw new Error("Failed to add task to database");
  }
};


// Get all tasks from Redis
exports.getAllTasksFromRedis = async (categoryId) => {
  let tasks = JSON.parse(await client.get("tasks")) || [];
  let filteredTasks = [];
  try {
    for (let task of tasks) {
      filteredTasks.push(task);
    }
    return filteredTasks;
  } catch (error) {
    console.error(error)
  }
};

// Update a task in Redis
exports.updateTaskInRedis = async (id, title, deadline, tags, reminder) => {
  try {
    // Fetch tasks from Redis
    const tasksData = await client.get("tasks");
    if (!tasksData) {
      throw new Error("No tasks found");
    }

    // Parse the tasks JSON
    let tasks = JSON.parse(tasksData);

    // Find the task by ID
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // Update the task's properties
    const updatedTask = {
      ...tasks[taskIndex],
      title: title || tasks[taskIndex].title,
      deadline: deadline || tasks[taskIndex].deadline,
      tags: tags || tasks[taskIndex].tags,
      reminder: reminder || tasks[taskIndex].reminder,
    };

    // Replace the old task with the updated one
    tasks[taskIndex] = updatedTask;

    // Save the updated tasks array back to Redis
    await client.set("tasks", JSON.stringify(tasks));

    if (reminder) {
      scheduleReminder(updatedTask)
    }

    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
};

// Delete a task from Redis
exports.deleteTaskFromRedis = async (id) => {
  try {
    // Get the tasks array from Redis
    const tasksData = await client.get("tasks");
    if (!tasksData) {
      throw new Error("No tasks found");
    }

    // Parse the tasks JSON
    let tasks = JSON.parse(tasksData);

    // Check if the task exists
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }

    // Remove the task
    tasks.splice(taskIndex, 1);

    // Save the updated tasks array back to Redis
    await client.set("tasks", JSON.stringify(tasks));

    return id;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};
