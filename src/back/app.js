//@ts-check
const { MainServer } = require('./server');

let server = new MainServer();
console.log('Starting server')
server.start();