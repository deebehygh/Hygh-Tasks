import React, { useState, useEffect } from 'react';
import { useTheme, themes } from "../Settings/Themes";
import { useNotifications, NotificationType } from '../Misc/Notifications';

export const TaskItem = ({ task, updateTask, deleteTask, setEditingTask, editingTask, editTask }) => {
    const { currentTheme } = useTheme();


    const handleEditClick = () => {
        setEditingTask(task.id);
    };

    const handleSaveClick = (id, text, deadline) => {
        editTask(id, text, deadline);
    };

    return (
        <div className={`task-item ${themes[currentTheme].card} ${themes[currentTheme].text}`}>
            {editingTask === task.id ? (
                <div>
                    <input
                        type="text"
                        defaultValue={task.text}
                        id={`task-text-${task.id}`}
                        className={`${themes[currentTheme].bg} ${themes[currentTheme].text}`}
                    />
                    <input
                        type="date"
                        defaultValue={task.deadline.split('T')[0]}
                        id={`task-deadline-${task.id}`}
                        className={`${themes[currentTheme].bg} ${themes[currentTheme].text}`}
                    />
                    <button className={`${themes[currentTheme].button} ${themes[currentTheme].text}`} onClick={() => handleSaveClick(task.id, document.getElementById(`task-text-${task.id}`).value, document.getElementById(`task-deadline-${task.id}`).value)}>Save</button>
                    <button className={`${themes[currentTheme].button} ${themes[currentTheme].text}`} onClick={() => setEditingTask(null)}>Cancel</button>
                </div>
            ) : (
                <>
                    <div className={`task-item ${themes[currentTheme].card} ${themes[currentTheme].text}`}>
                        {/* Task Information */}
                        <div className={`task-details ${themes[currentTheme].card} ${themes[currentTheme].text}`}>
                            <p className={`task-text ${themes[currentTheme].text}`}>
                                <span className={`task-status ${task.status}`}>({task.status})</span> {task.text} 
                            </p>
                            <p className={`task-deadline ${themes[currentTheme].text}`}><span>Deadline: {task.deadline || 'No Deadline'}</span></p>
                        </div>
                        {/* Status Dropdown */}
                        <div className="status-dropdown">
                            <select value={task.status} onChange={(e) => updateTask(task.id, e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                            </select>
                        </div>

                        {/* Edit/Delete Dropdown as Tooltip */}
                        <div className="task-buttons">
                            <div className="dropdown">
                                <button className="dropdown-btn">
                                    <i className="fas fa-ellipsis-v"></i> {/* Dropdown Icon */}
                                </button>
                                
                                <div className="dropdown-content">
                                    <button className={`${themes[currentTheme].button} ${themes[currentTheme].text}`} onClick={handleEditClick}><i className="fas fa-edit"></i> Edit</button>
                                    <button className={`${themes[currentTheme].button} ${themes[currentTheme].text}`} onClick={() => deleteTask(task.id)}><i className="fas fa-trash"></i> Delete</button>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </>
            )}
        </div>
    );
}