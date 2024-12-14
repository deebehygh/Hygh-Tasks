import React, { useState, useEffect } from 'react';
import { useTheme, themes } from "../Settings/Themes";

export const TaskInput = ({ newTask, setNewTask, deadline, setDeadline, addTask, setFilter }) => {
    const { currentTheme } = useTheme();
    return (
        <div className={`task-input`}>
            <input
                type="text"
                placeholder="Task description"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                className={`${themes[currentTheme].bg} ${themes[currentTheme].text}`}
            />
            <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                className={`${themes[currentTheme].bg} ${themes[currentTheme].text}`}
            />
            <button className={`task-input ${themes[currentTheme].button} ${themes[currentTheme].text}`} onClick={addTask}>Add Task</button>
            <label className={`${themes[currentTheme].text}`}>Sort By:</label>
            <select onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
            </select>
        </div>
    );
}