const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let isDev;

function createWindow() {
  isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../public/icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  const startUrl = isDev 
    ? 'http://localhost:5174' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Set Arabic RTL menu
  const template = [
    {
      label: 'نظام إدارة النادي الرياضي',
      submenu: [
        {
          label: 'حول التطبيق',
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'إخفاء التطبيق',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'إخفاء الآخرين',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: 'إظهار الكل',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'إنهاء',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

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

// IPC handlers for database operations
ipcMain.handle('database-query', async (event, query, params) => {
  const { DatabaseService } = require('./database.cjs');
  return DatabaseService.query(query, params);
});

ipcMain.handle('database-run', async (event, query, params) => {
  const { DatabaseService } = require('./database.cjs');
  return DatabaseService.run(query, params);
});

// Login handler
ipcMain.handle('login', async (event, username, password) => {
  try {
    const { DatabaseService } = require('./database.cjs');
    const bcrypt = require('bcryptjs');
    
    // Query user with gym information
    const users = await DatabaseService.query(`
      SELECT u.*, g.name as gym_name, g.type as gym_type 
      FROM users u 
      JOIN gyms g ON u.gym_id = g.id 
      WHERE u.username = ? AND u.is_active = 1
    `, [username]);

    if (users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const userData = users[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    
    if (!isValidPassword) {
      return { success: false, message: 'Invalid password' };
    }

    const userSession = {
      id: userData.id,
      username: userData.username,
      full_name: userData.full_name,
      role: userData.role,
      gym_id: userData.gym_id,
      gym_name: userData.gym_name,
      gym_type: userData.gym_type
    };

    return { success: true, user: userSession };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Debug handler to check database content
ipcMain.handle('debug-users', async () => {
  try {
    const { DatabaseService } = require('./database.cjs');
    const users = await DatabaseService.query('SELECT * FROM users');
    const gyms = await DatabaseService.query('SELECT * FROM gyms');
    return { users, gyms };
  } catch (error) {
    console.error('Debug error:', error);
    return { error: error.message };
  }
});

// Debug handler to check password hashes
ipcMain.handle('debug-passwords', async () => {
  try {
    const { DatabaseService } = require('./database.cjs');
    const users = await DatabaseService.query('SELECT username, password_hash FROM users');
    return { users };
  } catch (error) {
    console.error('Debug passwords error:', error);
    return { error: error.message };
  }
});

// Debug handler to test login directly
ipcMain.handle('debug-login', async (event, username, password) => {
  try {
    const { DatabaseService } = require('./database.cjs');
    const bcrypt = require('bcryptjs');
    
    console.log('Testing login for:', username, password);
    
    // Query user with gym information
    const users = await DatabaseService.query(`
      SELECT u.*, g.name as gym_name, g.type as gym_type 
      FROM users u 
      JOIN gyms g ON u.gym_id = g.id 
      WHERE u.username = ? AND u.is_active = 1
    `, [username]);

    console.log('Found users:', users);

    if (users.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const userData = users[0];
    console.log('User data:', userData);
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return { success: false, message: 'Invalid password' };
    }

    const userSession = {
      id: userData.id,
      username: userData.username,
      full_name: userData.full_name,
      role: userData.role,
      gym_id: userData.gym_id,
      gym_name: userData.gym_name,
      gym_type: userData.gym_type
    };

    return { success: true, user: userSession };
  } catch (error) {
    console.error('Debug login error:', error);
    return { success: false, message: 'Login failed', error: error.message };
  }
});