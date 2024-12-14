import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import TodoList from '../Todo/TodoItem';
const socket = io('http://localhost:3001');

export const Home = () => {

    return (
        <div className="app">
            <TodoList />
        </div>
    );
}
