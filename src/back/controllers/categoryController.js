const { addCategory, getAllCategories, deleteCategory } = require("../models/categoryModel");
const { getIO } = require("../socket");
// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    const io = getIO();
    io.emit("categoryFetch", categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });
  const category = await addCategory(Date.now(), name);
  const io = getIO();
  io.emit("categoryAdded", category);
  res.status(201).json(category);
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteCategory(id);
    const io = getIO();
    io.emit("categoryDeleted", id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
