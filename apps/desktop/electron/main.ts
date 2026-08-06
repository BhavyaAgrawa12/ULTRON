import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { spawn, ChildProcess } from 'node:child_process';
import http from 'node:http';

let mainWindow: BrowserWindow | null = null;
let pythonProcess: ChildProcess | null = null;

// Centralized logging helper for Electron main process
function writeLog(message: string, isError = false) {
  const timestamp = new Date().toISOString();
  const tag = isError ? '[ERROR]' : '[INFO]';
  const entry = `[${timestamp}] ${tag} ${message}\n`;
  console.log(entry.trim());

  try {
    const rootLogsDir = path.resolve(__dirname, '../../logs');
    if (!fs.existsSync(rootLogsDir)) {
      fs.mkdirSync(rootLogsDir, { recursive: true });
    }
    const logFilePath = path.join(rootLogsDir, 'ultron.log');
    fs.appendFileSync(logFilePath, entry, 'utf-8');
  } catch (err) {
    console.error('Failed writing log:', err);
  }
}

function checkBackendHealth(): Promise<{ status: string; service: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get('http://127.0.0.1:8000/health', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (err) => reject(err));
    req.setTimeout(2000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function startBackendAndPoll() {
  writeLog('Backend Started');

  // Try checking if backend is already active or spawn it
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    try {
      const res = await checkBackendHealth();
      if (res && res.status === 'ok') {
        writeLog('Health Check Passed');
        return true;
      }
    } catch {
      // If not active and process not spawned yet, attempt to spawn python backend
      if (!pythonProcess && attempts === 0) {
        const rootDir = path.resolve(__dirname, '../../');
        const coreApiDir = path.join(rootDir, 'services/core-api');
        
        try {
          pythonProcess = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
            cwd: coreApiDir,
            shell: true,
            stdio: 'ignore',
          });
        } catch (e) {
          writeLog(`Failed to spawn Python backend: ${String(e)}`, true);
        }
      }
    }
    attempts++;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function createWindow() {
  writeLog('Electron Started');

  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    title: 'ULTRON',
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  createWindow();
  startBackendAndPoll();

  ipcMain.handle('check-health', async () => {
    try {
      const res = await checkBackendHealth();
      return res;
    } catch (e) {
      return { status: 'offline', error: String(e) };
    }
  });
});

app.on('window-all-closed', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
