import axios from "axios";
import React, { useState } from "react";
import { Box, Typography, IconButton, TextField, Badge, Divider } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { io } from "socket.io-client";
import { useTheme } from "@mui/material/styles";
import { NotificationType, useNotifications } from "../Misc/Notifications";

const socket = io("http://localhost:5000");

const CategoryList = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const { addNotification } = useNotifications();
  const theme = useTheme();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addCategory();
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/categories", {
        id: -1,
        name: newCategory,
        dateCreated: Date.now(),
        numberOfTasks: 0
      });

      if (response.status === 201) {
        const newCat = response.data;
        setCategories([...categories, newCat]);
        addNotification(NotificationType.SUCCESS, `Added the new category '${newCat.name}'`);
        setNewCategory("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      addNotification(NotificationType.ERROR, "Failed to add category.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
      addNotification(NotificationType.SUCCESS, "Category deleted successfully.");
    } catch (error) {
      console.error("Error deleting category:", error);
      addNotification(NotificationType.ERROR, "Failed to delete category.");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", justifyContent: "center", margin: "0 auto", padding: "20px" }}>
      <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
        Manage Categories
      </Typography>

      {/* Input for Adding a New Category */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <TextField
          label="Add New Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <IconButton color="primary" onClick={addCategory}>
          <Add />
        </IconButton>
      </Box>

      {/* Category List */}
      <Box sx={{
          maxHeight: "400px", // Adjust height as needed
          overflowY: "auto",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px 20px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              {/* Category ID */}
              <Typography variant="body2" sx={{ flex: 1, textAlign: "left", color: theme.palette.text.secondary }}>
                ID: {category.id}
              </Typography>

              {/* Category Name */}
              <Typography
                variant="h6"
                sx={{ flex: 2, textAlign: "center", fontWeight: "bold", color: theme.palette.text.primary }}
              >
                {category.name}
              </Typography>

              {/* Task Count */}
              <Badge
                badgeContent={category.numberOfTasks}
                color="primary"
                sx={{ flex: 1, textAlign: "right", marginRight: "10px" }}
              >
              </Badge>

              {/* Delete Button */}
              <IconButton color="error" onClick={() => deleteCategory(category.id)}>
                <Delete />
              </IconButton>
            </Box>
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryList;
