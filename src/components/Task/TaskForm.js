import React, { useState, useEffect } from "react";
import { FaCalendar, FaBell, FaPlus, FaTag, FaTasks, FaPlusCircle, FaSearch } from "react-icons/fa";
import { Button, Chip, List, ListItem, Popover, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { io } from "socket.io-client";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useNotifications, NotificationType } from "../Misc/Notifications";

const socket = io("http://localhost:5000");


const TaskForm = ({ category, setTasks }) => {
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For calendar popover
  const [showIcons, setShowIcons] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [reminderAnchor, setReminderAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const theme = useTheme();
  const { addNotification } = useNotifications();

  const styles = {
    container: {
      
      display: "flex",
      alignItems: "center",
      padding: "8px",
      margin: "16px auto",
      flexDirection: "column",
      gap: "8px",
      maxWidth: "40em",
      width: "auto",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "8px",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "16px",
      padding: "4px",
      width: "30em",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
    },
    icon: {
      fontSize: "18px",
      color: "#888",
      cursor: "pointer",
      marginLeft: "8px",
      transition: "color 0.2s",
    },
    tagContainer: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "8px",
    },
    tagChip: {
      marginBottom: "8px",
    },
    tagInput: {
      flex: "1",
    },
    addButton: {
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
    },
    span: {
      fontSize: "12px",
      color: theme.palette.text.secondary,
    },
    iconsContainer: {
      display: "flex",
      gap: "8px",
      marginTop: "10px",
      justifyContent: "flex-end", // Align icons to the right
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tags");
        setAvailableTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);


  const handleDateClick = (event) => setCalendarAnchor(event.currentTarget);
  const handleReminderClick = (event) => setReminderAnchor(event.currentTarget);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
    setShowIcons(e.target.value.trim() !== ""); // Show icons only when input is not empty
  };

  const handleDateSelect = (newDate) => {
    setDeadline(newDate.format("YYYY-MM-DD"));
    setCalendarAnchor(null); // Close popover
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) {
      return addNotification(NotificationType.ERROR, 'Can not add an empty task!')
    }
    if (!deadline) {
      return addNotification(NotificationType.ERROR, 'No deadline was selected!')
    }
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", {
        id: Date.now(),
        title: newTask,
        deadline,
        status: "pending",
        category: category,
      });

      if (response.ok) {
        const createdTask = response.data;
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        socket.emit("taskAdded", createdTask);
      }
    } catch (err) {
      addNotification(NotificationType.ERROR, 'Error occurred while adding task!')
      console.log(`Error adding tasks: ${err}`);
    }
    setNewTask("");
    setDeadline("");
    setTags([]);
    setReminder(null);
    setSelectedTags([]);
    addNotification(NotificationType.SUCCESS, 'Successfully added new task.');
  };

  const handleTagSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setAnchorEl(null); // Close the popover
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleAddNewTag = async () => {
    const newTag = prompt("Enter the new tag:");
    if (newTag) {
      try {
        const response = await axios.post("http://localhost:5000/api/tags", { name: newTag });
        if (response.status === 201) {
          setAvailableTags((prev) => [...prev, response.data]);
        }
      } catch (error) {
        console.error("Error adding new tag:", error);
      }
    }
  };

  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Input Field */}
      <div style={styles.inputContainer}>
        <div className="task-details">
          <FaTasks style={styles.icon} />
          {deadline && <p style={styles.span}>{deadline}</p>}
          <input
            type="text"
            value={newTask}
            onChange={handleInputChange}
            placeholder="Type your task..."
            style={styles.input}
            onKeyDown={handleKeyDown}
          />
        </div>
        {selectedTags.length > 0
          ? selectedTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              style={{ backgroundColor: "#e0e0e0", fontSize: "11px" }}
            />
          ))
          : <Typography></Typography>}
        {/* Icons */}
        {showIcons && (
          <div style={{
            ...styles.iconsContainer,
            opacity: showIcons ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}>
            <FaPlusCircle
              title="Add task"
              style={styles.icon}
              onClick={addTask}
            />
            <FaCalendar
              title="Add due date"
              style={styles.icon}
              onClick={handleDateClick}
            />
            { /* <FaTag
              title="Add tags"
              style={styles.icon}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ marginTop: "10px" }}
            /> */}
          </div>
        )}
      </div>
      {/* Date Picker Popover */}
      <Popover
        open={Boolean(calendarAnchor)}
        anchorEl={calendarAnchor}
        onClose={() => setCalendarAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={deadline ? dayjs(deadline) : null}
            onChange={handleDateSelect}
          />
        </LocalizationProvider>
      </Popover>

      {/* Popover for Reminder */}
      <Popover
        open={Boolean(reminderAnchor)}
        anchorEl={reminderAnchor}
        onClose={() => setReminderAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar value={reminder ? dayjs(reminder) : null} onChange={setReminder} />
        </LocalizationProvider>
      </Popover>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <div style={{ padding: "10px", width: "250px" }}>
          <TextField
            placeholder="Search tags"
            value={searchQuery}
            onChange={handleTagSearch}
            fullWidth
            InputProps={{
              startAdornment: <FaSearch style={{ marginRight: "10px" }} />,
            }}
          />
          {filteredTags.length > 0 ? (
            <List>
              {filteredTags.map((tag) => (
                <ListItem
                  key={tag.id}
                  button
                  onClick={() => handleTagSelect(tag.name)}
                >
                  {tag.name}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No tags found.</Typography>
          )}
          <Button
            variant="outlined"
            startIcon={<FaPlus />}
            onClick={handleAddNewTag}
            fullWidth
            sx={{ marginTop: "10px" }}
          >
            Add a New Tag
          </Button>
        </div>
      </Popover>
    </div>
  );
};

export default TaskForm;
