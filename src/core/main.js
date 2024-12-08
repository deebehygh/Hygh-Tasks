const { app, BrowserWindow } = require('electron');
const { join } = require('node:path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

require('electron-reload');

app.on('ready', () => {
    // Start the Express server
    const serverPath = join(__dirname, '../server/app.js'); // Path to server entry file
    serverProcess = spawn('node', [serverPath], { stdio: 'inherit' });

    // Open the Electron window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        title: 'Hygh Duties',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Point to React app
    const isDev = !app.isPackaged;
    const reactURL = isDev
        ? 'http://localhost:5000'
        : `file://${join(__dirname, '../client/public/index.html')}`;

    mainWindow.loadURL(reactURL);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

// Ensure server stops when the app quits
app.on('quit', () => {
    if (serverProcess) {
        serverProcess.kill();
    }
});
