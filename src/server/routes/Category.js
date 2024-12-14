const { Router } = require("express");
const { v4: uuidv4 } = require('uuid');
const Rout = Router();

module.exports = (io, db, secretKey, logger) => {

    // Get all categories
    Rout.get("/", async (req, res) => {
        const categories = await db.get('cates');
        res.json(JSON.parse(categories) || []);
    });

    // Create a new category
    Rout.post("/", async (req, res) => {
        const { name } = req.body;

        if (!name) return res.status(400).send("Category name is required");

        let categories = JSON.parse(await db.get('cates')) || [];
        const newCategory = { id: Date.now(), name };
        categories.push(newCategory);

        await db.set('cates', JSON.stringify(categories));
        io.emit("updateCategories", categories); // Real-time update
        res.json(categories);
    });

    //RoutDelete a category
    Rout.delete("/:id", async (req, res) => {
        const categoryId = req.params.id;

        try {
            // Delete all tasks in the category
            await redisClient.del(`tasks_${categoryId}`); // Delete the key holding tasks for the category
    
            // Delete the category
            const categories = JSON.parse(await redisClient.get("categories")) || [];
            const updatedCategories = categories.filter(category => category.id !== categoryId);
            await redisClient.set("categories", JSON.stringify(updatedCategories));
    
            io.emit("updateCategories"); // Notify clients about category changes
            io.emit("updateTasks");      // Notify clients to refresh tasks
    
            res.status(200).json({ message: 'Category and its tasks deleted successfully.' });
        } catch (error) {
            console.error('Error deleting category and its tasks:', error);
            res.status(500).json({ error: 'Failed to delete category and its tasks.' });
        }
    });

    // Reorder categories
    Rout.post("/reorder", async (req, res) => {
        const { reorderedCategories } = req.body;

        await db.set('cates', JSON.stringify(reorderedCategories));
        io.emit("updateCategories", reorderedCategories);
        res.json(reorderedCategories);
    });

    return Rout;
}