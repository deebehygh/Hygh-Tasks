const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Routes
router.get("/:categoryId", taskController.getAllTasks);
router.post("/", taskController.addTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
