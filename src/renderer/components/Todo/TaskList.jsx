import React, { useState, useEffect } from 'react';
import { TaskItem } from "./TaskItem";

export const TaskList = ({ tasks, updateTask, deleteTask, setEditingTask, editingTask, editTask }) => {
    return (
        <div className="task-list">
            {tasks == undefined || tasks == null ? "No tasks" : tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    setEditingTask={setEditingTask}
                    editingTask={editingTask}
                    editTask={editTask}
                />
            ))}
        </div>
    );
}