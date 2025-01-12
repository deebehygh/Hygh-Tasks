const redis = require("redis");
const { getAllTasksFromRedis, deleteTaskFromRedis } = require("./taskModel");
const client = redis.createClient({ url: 'redis://default:7yZMF3RYUWDKMnGSkGgQuo1OANqHYdnM@redis-16063.c278.us-east-1-4.ec2.redns.redis-cloud.com:16063', legacyMode: false });

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect();

const CATEGORY_KEY = "categories";

exports.getCategoryNextId = async () => {
  const categories = await client.get('nextCatID');
  if (!categories || categories == null) return await client.set('nextCatID', 1)
  return categories;
}

// Add a category
exports.addCategory = async (id, name) => {
  let categories = await this.getAllCategories();
  let catId = await this.getCategoryNextId();
  const newCategory = { 
    id: catId++, 
    name,
    dateCreated: Date.now(),
    numberOfTasks: 0
  }
  categories.push(newCategory);
  await client.incr('nextCatID');
  await client.set(CATEGORY_KEY, JSON.stringify(categories));
  return { id: newCategory.id, name: newCategory.name };
};

exports.getAllCategories = async () => {
  try {
    const categories = await client.get("categories");
    return JSON.parse(categories) || [];
  } catch (error) {
    console.error("Error fetching categories from Redis:", error);
    return [];
  }
};

// Delete a category
exports.deleteCategory = async (id) => {
  try {
    let categoriesData = await this.getAllCategories(); // Fetch all categories

    const categoryIndex = categoriesData.findIndex((category) => category.id == id);
    if (categoryIndex === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }

    const tasks = await getAllTasksFromRedis();
    console.log("Fetched Tasks: ", tasks); 

    const tasksToDelete = tasks.filter(task => task.categoryId == id);

    if (tasksToDelete.length > 0) {
      for (const task of tasksToDelete) {
        await deleteTaskFromRedis(task.id);
      }
      
    }
    console.log("Deleted tasks:", tasksToDelete);
    categoriesData.splice(categoryIndex, 1);
    await client.set("categories", JSON.stringify(categoriesData));

    return { message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};