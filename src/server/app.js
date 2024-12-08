const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const { join } = require('node:path')
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const redisClient = redis.createClient(); // Redis connection

redisClient.connect();

const TODO_KEY = 'todos';
const DEV_MODE = true;

app.use(express.json());
app.use(express.static(join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(!DEV_MODE ? join(__dirname, '../client/build/index.html') : join(__dirname, '../client/public/index.html'));
});

// Handle WebSocket connections
io.on('connection', async (socket) => {
    console.log('A user connected.');

    // Load initial todos from Redis
    const todos = JSON.parse(await redisClient.get(TODO_KEY)) || [];
    socket.emit('updateTodos', todos);

    socket.on('addTodo', async (todo) => {
        todos.push(todo);
        await redisClient.set(TODO_KEY, JSON.stringify(todos));
        io.emit('updateTodos', todos); // Notify all clients
    });

    socket.on('deleteTodo', async (index) => {
        todos.splice(index, 1);
        await redisClient.set(TODO_KEY, JSON.stringify(todos));
        io.emit('updateTodos', todos);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
