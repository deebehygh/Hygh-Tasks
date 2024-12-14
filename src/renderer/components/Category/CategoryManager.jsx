import React, { useState } from "react";

function CategoryManager({ addNotification, categories, setCategories, selectedCategory, handleCategoryClick }) {
  const [newCategory, setNewCategory] = useState("");
  

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const response = await fetch("http://localhost:3001/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory }),
    });
    const updatedCategories = await response.json();
    setCategories(updatedCategories);
    setNewCategory("");
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
        await axios.delete(`http://localhost:3001/categories/${categoryId}`);
        setCategories(categories.filter(category => category.id !== categoryId)); // Update categories
        setTasks([]); // Clear tasks since category tasks are deleted
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};

  const handleReorder = async (fromIndex, toIndex) => {
    const reordered = [...categories];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);

    const response = await fetch("http://localhost:3001/categories/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorderedCategories: reordered }),
    });
    const updatedCategories = await response.json();
    setCategories(updatedCategories);
  };

  return (
    <div className="category-manager">
      <h2>Categories</h2>
      <div>
        <input
          type="text"
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>
      <ul>
        {categories.map((category, index) => (
          <li key={category.id} 
          onClick={() => handleCategoryClick(category)}
          style={{
              cursor: "pointer",
              fontWeight: category.id === selectedCategory?.id ? "bold" : "normal",
          }}>
            <span>{category.name}</span>
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            <button
              onClick={() => index > 0 && handleReorder(index, index - 1)}
            >
              ↑
            </button>
            <button
              onClick={() =>
                index < categories.length - 1 && handleReorder(index, index + 1)
              }
            >
              ↓
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;
