import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Sidebar } from './Sidebar';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { useTheme } from '../Settings/Themes';
import CategoryManager from '../Category/CategoryManager';

const socket = io('http://localhost:3001');

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [newTask, setNewTask] = useState('');
    const [deadline, setDeadline] = useState('');
    const [fillter, setFilter] = useState('all'); // pending, completed, overdue, all
    const [editingTask, setEditingTask] = useState(null); // State for editing task
    const { currentTheme } = useTheme();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
        socket.on("updateTasks", fetchTasks);
        socket.on("updateCategories", fetchCategories);
        return () => socket.off('tasksUpdated');
    }, []);


    const fetchCategories = async () => {
        const response = await fetch("http://localhost:3001/categories");
        const data = await response.json();
        setCategories(data);
    };


    const fetchTasks = async (category) => {
        setLoading(true); // Show loading before fetching data
        try {
            if (category) {
                const response = await axios.get(`http://localhost:3001/todos/${category.id}`);
                console.log('Tasks fetched: ', response);
                setTasks(response.data);
            }
        } catch (error) {
            console.log('Error fetching tasks:', error);
        } finally {
            setLoading(false); // Hide loading after fetch
        }
    };
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchTasks(category);
    };

    const addTask = async () => {
        if (!newTask.trim() || !deadline || !selectedCategory) return;
    
        try {
            const response = await axios.post('http://localhost:3001/todos', {
                text: newTask,
                deadline,
                categoryId: selectedCategory.id,
            });
    
            setTasks((prevTasks) => [...prevTasks, response.data]); // Append the new task
            setNewTask('');
            setDeadline('');
            
            setSelectedCategory(selectedCategory)
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTask = async (id, status) => {
        try {
            const response = await axios.put(`http://localhost:3001/todos/${id}`, { status });
            setTasks(tasks.map(task => task.id === id ? response.data : task));
            
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/todos/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
            
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = async (id, text, deadline) => {
        try {
            const response = await axios.put(`http://localhost:3001/todos/${id}`, { text, deadline });
            setTasks(tasks.map(task => task.id === id ? response.data : task));
            setEditingTask(null); // Close the edit form after saving
            
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const getFilteredTasks = () => {
        const filtered = [];
        for (let task of tasks) {
            if (fillter === 'all') {
                filtered.push(task);
            } else if (new Date(task.deadline) > new Date() && task.status === 'overdue') {
                fillter.push(task)
            } else if (new Date(task.deadline) < new Date() && task.status === 'pending') {
                filtered.push(task);
            }
            if (task.status === fillter) {
                filtered.push(task);
            }
        }
        return filtered;
    }


    const filteredTasks = getFilteredTasks();

    return (

        <div className="app-container">
            <CategoryManager selectedCategory={selectedCategory} handleCategoryClick={handleCategoryClick} categories={categories} setCategories={setCategories} />
            <div className="task-container">
                <TaskInput
                    newTask={newTask}
                    setNewTask={setNewTask}
                    deadline={deadline}
                    setDeadline={setDeadline}
                    addTask={addTask}
                    setFilter={setFilter}
                />
                {loading ? (<p>Loading tasks...</p>) : (
                    <div>
                        {selectedCategory ? (
                            <>
                                <h2>Tasks in {selectedCategory.name}</h2>
                                <TaskList tasks={filteredTasks}
                                    updateTask={updateTask}
                                    deleteTask={deleteTask}
                                    setEditingTask={setEditingTask}
                                    editingTask={editingTask}
                                    editTask={editTask}
                                />
                            </>
                        ) : (
                            <h2>Select a category to view tasks</h2>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}

export default TodoList;