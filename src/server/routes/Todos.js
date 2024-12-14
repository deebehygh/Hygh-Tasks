const { Router } = require("express");
const { v4: uuidv4 } = require('uuid');
const router = Router();

module.exports = (io, db, secretKey, logger) => {
    const emitTasks = async () => {
        const tasks = await db.hGetAll('tasks');
        const parsedTasks = Object.values(tasks).map(task => JSON.parse(task));
        io.emit('tasksUpdated', parsedTasks);
    };

    router.get("/:categoryId", async (req, res, next) => {
        const categoryId = parseInt(req.params.categoryId);
        const status = req.query.status; // Optional status query param (e.g., pending, completed)

        let tasks = JSON.parse(await db.get("tasks")) || [];
        let filteredTasks = [];

        for (let task of tasks) {
            if (task.categoryId === categoryId) {
                if (!status || task.status === status) {
                    filteredTasks.push(task);
                }
            }
        }

        res.json(filteredTasks);
    });

    router.post('/', async (req, res) => {
        const { text, deadline, categoryId } = req.body;

        if (!text || !categoryId)
            return res.status(400).send("Task text and categoryId are required");

        let tasks = JSON.parse(await db.get("tasks")) || [];
        const newTask = {
            id: Date.now(),
            text,
            deadline,
            status: "pending",
            categoryId,
        };

        tasks.push(newTask);
        await db.set("tasks", JSON.stringify(tasks));
        io.emit("updateTasks", tasks);
        res.json(tasks);
    });

    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { status, text, deadline } = req.body;
        try {
            const task = await db.hGet('tasks', id);
            if (!task) return res.status(404).send('Task not found');

            const updatedTask = JSON.parse(task);
            updatedTask.status = status || updatedTask.status;
            updatedTask.text = text || updatedTask.text;
            updatedTask.deadline = deadline || updatedTask.deadline;

            await db.hSet('tasks', id, JSON.stringify(updatedTask));
            res.json(updatedTask);
            emitTasks();
        } catch (error) {
            res.status(500).send('Error updating task');
        }
    });

    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await db.hDel('tasks', id);
            res.status(204).send();
            emitTasks();
        } catch (error) {
            res.status(500).send('Error deleting task');
        }
    });
    return router;
}