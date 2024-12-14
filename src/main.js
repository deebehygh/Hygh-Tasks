try {
    require('electron-reloader')(module);
} catch (_) {}

const { app, BrowserWindow, ipcMain } = require('electron');
const { MainServer } = require('./server/server');
const express = require('express');
const cors = require('cors');
const { join } = require('node:path');
const electronMain = require('@electron/remote/main');
const server = new MainServer();

electronMain.initialize();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            enableRemoteModule: true,
            allowRunningInsecureContent: false
        },
    });

    electronMain.enable(win.webContents);

    win.loadURL('http://localhost:3001');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    const serverInstance = server.server;
    server.start();
    createWindow();

    app.on('will-quit', () => {
        if (serverInstance) {
            serverInstance.close(() => {
                console.log('Server closed.');
            });
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

