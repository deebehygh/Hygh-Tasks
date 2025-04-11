import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaExclamationCircle, FaSave, FaCalendar, FaStop } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import axios from "axios";
import useSound from 'use-sound';
import { io } from 'socket.io-client';
import { useTheme } from "@mui/material/styles";
import { Button, CircularProgress, FormGroup, Popover } from "@mui/material";
import soundEffect from '../audio/complete.mp3'
import { useNotifications, NotificationType } from "../Misc/Notifications";
const socket = io('http://localhost:5000');

const TaskItem = ({ task, setTasks, tasks, deleteConfirm, setDeleteConfirm, showDates, setShowDates }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [calendarAnchor, setCalendarAnchor] = useState(null);
  const [play] = useSound(soundEffect);
  const theme = useTheme();
  const { addNotification } = useNotifications();

  const styles = {
    item: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      padding: "10px 15px",
      borderRadius: "5px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
      backgroundColor: theme.palette.background.sidebar,
      color: theme.palette.text.primary,
      
    },
    details: {
      width: "990px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: theme.palette.text.primary,
    },
    h3: {
      color: theme.palette.text.primary,
      overflowWrap: "break-word"
    },
    p: {
      color: theme.palette.text.secondary,
      wordWrap: "break-word"
    },
    span: {
      color: theme.palette.text.secondary,
    },
    input: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      padding: "8px",
      width: "100%",
    },
    input: {
      flex: 2,
      border: "none",
      outline: "none",
      fontSize: "16px",
      padding: "4px",
      width: "300px",
      margin: "10px",
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
    },
    icon: {
      cursor: "pointer",
      color: theme.palette.text.primary,
    }
  };


  useEffect(() => {
    socket.on("taskDeleted", (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    });

    return () => socket.off("taskDeleted");
  }, []);

  const editTask = async (id, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, updatedTask);
      const oldTask = tasks.find((task) => task.id === id);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      play();
      addNotification(NotificationType.SUCCESS, `Successfully edited task: [${id}] ${oldTask?.title || "Unknown"} -> ${updatedTask.title}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      addNotification(NotificationType.SUCCESS, 'Successfully deleted task.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (tk) => {
    editTask(tk.id, editedTask);
    setIsEditing(false);
  };
  const handleIsDeleting = (tk) => {
    setIsDeleting(true);
  };
  const handleDelete = (tk) => {
    deleteTask(tk.id);
    setIsDeleting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "complete":
        return <FaCheckCircle color="green" />;
      case "pending":
        return <FaClock color="orange" />;
      case "overdue":
        return <FaExclamationCircle color="red" />;
      default:
        return null;
    }
  };

  const handleDateClick = (event) => setCalendarAnchor(event.currentTarget);
  const handleDateSelect = (newDate) => {
    setEditedTask({ ...editedTask, deadline: newDate.format("YYYY-MM-DD") })
    setCalendarAnchor(null);
  };

  return (
    <li className={`${task.status}`} style={styles.item}>
      {isEditing ? (
        <div>
          <div style={styles.inputContainer}>
          <CircularProgress size={24} style={styles.h3} />
            <input
              type="text"
              value={editedTask.title}
              style={styles.input}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
            <Tooltip title="Select New Date">
              <IconButton value={editedTask.deadline} onClick={handleDateClick}>
                <FaCalendar style={styles.icon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Edit">
              <IconButton onClick={() => handleEdit(task)}>
                <FaSave style={styles.icon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Canel Editing">
              <IconButton onClick={() => setIsEditing(false)}>
                <FaStop style={styles.icon} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="task-details" style={styles.details}>
          <p>{getStatusIcon(task.status)}</p>
          <div>
            <h3 style={styles.h3}>{task.title}</h3>
            {showDates && 
              <p style={styles.p}>
                Start: {task.startDate} | Deadline: {task.deadline}
              </p>
            }
          </div>
          <div >
            <Tooltip title="Edit Task">
              <IconButton onClick={() => setIsEditing(true)}>
                <EditIcon style={styles.icon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton onClick={() => {deleteConfirm ? setIsDeleting(true) : deleteTask(task.id)}}>
                <DeleteIcon style={styles.icon} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
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
            value={editedTask.deadline ? dayjs(editedTask.deadline) : null}
            onChange={handleDateSelect}
          />
        </LocalizationProvider>
      </Popover>
      {isDeleting && 
        <Dialog
        open={() => setIsDeleting(true)}
        onClose={() => setIsDeleting(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task? Once this action is done, the task can be recovered from 'Trash Bin' but it will be permentally deleted after 30 days.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
          <Button onClick={() => handleDelete(task)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      }
    </li>

  );
};

export default TaskItem;
