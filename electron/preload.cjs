const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  query: (sql, params) => ipcRenderer.invoke('database-query', sql, params),
  run: (sql, params) => ipcRenderer.invoke('database-run', sql, params),
  
  // Authentication
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  
  // Debug
  debugUsers: () => ipcRenderer.invoke('debug-users'),
  debugPasswords: () => ipcRenderer.invoke('debug-passwords'),
  debugLogin: (username, password) => ipcRenderer.invoke('debug-login', username, password),
  
  // System info
  platform: process.platform,
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close')
});