import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { io } from "socket.io-client";

import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import Footer from "../Home/components/Footer";

const socket = io("http://localhost:5000");

const TaskList = ({ category, tasks, setTasks, deleteConfirm, setDeleteConfirm, showDates, setShowDates }) => {
  const theme = useTheme();
  const styles = {
    container: {
      width: "auto",
      maxWidth: "60em",
      margin: "1em auto",
      fontFamily: "Arial, sans-serif",
      justifyContent: "center",
    },
    list: {
      listStyle: "none",
      padding: "0",
    },
    h1: {
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    p: {
      textAlign: "center",
      color: theme.palette.text.secondary,
    }
  };

  useEffect(() => {
    socket.on("taskAdded", (newTask) => {
      if (newTask.category.id === category.id) {
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
    });

    return () => {
      socket.off("taskAdded");
    };
  }, [category, setTasks]);

  
  return (
    <div style={styles.container}>
      <ul style={styles.list}>
        <h2 style={styles.h1}>{category.name}</h2>
        {tasks.length > 0 ? (
          tasks
            .filter((task) => task.category.id === category.id)
            .map((task) => (<TaskItem key={task.id} task={task} setTasks={setTasks} tasks={tasks} deleteConfirm={deleteConfirm} setDeleteConfirm={setDeleteConfirm} showDates={showDates}
              setShowDates={setShowDates} />))
        ) : (<p style={styles.p}>No tasks available in this category</p>)
        }
      </ul>
      <TaskForm category={category} setTasks={setTasks} />
    </div>
  );
};

export default TaskList;
