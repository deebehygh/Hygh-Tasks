const express = require('express')
const { createServer } = require('http');
const { join } = require('node:path');
const { createClient } = require('redis');
const { Logger } = require('./utils/Logger');
const { Server } = require('socket.io');
const todoRoutes = require('./routes/Todos');
const cateRoutes = require('./routes/Category');
const { json } = require('express');
const { promisify } = require('util');
const cors = require('cors');
require('dotenv/config');

class MainServer {
    logger = new Logger();
    app = express();
    server = createServer(this.app);
    io = new Server(this.server, { cors: { origin: '*' } });
    db = createClient({ url: process.env.REDIS_URL, legacyMode: false });

    constructor() {
        this.db.connect();
        this.handle_middleware();
        this.handle_events();
        this.handle_socket_connection();
    }

    handle_middleware = () => {
        const publicPath = join(__dirname, '../../dist');
        this.logger.info("Attemping to handle middleware");
        
        this.app.use(cors());
        this.app.use(json());
        this.app.use(express.static(publicPath));
    }

    handle_events = async () => {
        this.logger.info("Attemping to handle request");
        this.app.use('/todos', todoRoutes(this.io, this.db, process.env.SECRET, this.logger));
        this.app.use('/categories', cateRoutes(this.io, this.db, process.env.SECRET, this.logger));
    };

    handle_socket_connection = () => {
        const broadcastTasks = async () => {
            const tasks = await this.handle_get_task();
            this.io.emit('updateTasks', tasks);
        };
        
        this.app.set('socketio', this.io);
        this.app.set('broadcastTasks', broadcastTasks);
    }

    handle_get_task = async() => {
        const data = await this.db.hGetAll('todos');
        return data ? JSON.parse(data) : [];
    }

    handle_save_todo = async(tasks) => {
        await this.db.set('todos', JSON.stringify(tasks));
    }

    start = () => {
        this.io.on('connection', (socket) => {
            this.logger.event('A User connected.');
            socket.on('disconnect', () => {
                this.logger.event('A User disconnected.');
            });
        });

        this.server.listen(3001, () => {
            this.logger.info(`Starting server on port 3001`);
        });
    };

}

module.exports = { MainServer }