"use strict";
const electron = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const node_child_process = require("node:child_process");
const http = require("node:http");
let mainWindow = null;
let pythonProcess = null;
function writeLog(message, isError = false) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const tag = isError ? "[ERROR]" : "[INFO]";
  const entry = `[${timestamp}] ${tag} ${message}
`;
  console.log(entry.trim());
  try {
    const rootLogsDir = path.resolve(__dirname, "../../logs");
    if (!fs.existsSync(rootLogsDir)) {
      fs.mkdirSync(rootLogsDir, { recursive: true });
    }
    const logFilePath = path.join(rootLogsDir, "ultron.log");
    fs.appendFileSync(logFilePath, entry, "utf-8");
  } catch (err) {
    console.error("Failed writing log:", err);
  }
}
function checkBackendHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get("http://127.0.0.1:8000/health", (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", (err) => reject(err));
    req.setTimeout(2e3, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}
async function startBackendAndPoll() {
  writeLog("Backend Started");
  let attempts = 0;
  const maxAttempts = 15;
  while (attempts < maxAttempts) {
    try {
      const res = await checkBackendHealth();
      if (res && res.status === "ok") {
        writeLog("Health Check Passed");
        return true;
      }
    } catch {
      if (!pythonProcess && attempts === 0) {
        const rootDir = path.resolve(__dirname, "../../");
        const coreApiDir = path.join(rootDir, "services/core-api");
        try {
          pythonProcess = node_child_process.spawn("python", ["-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"], {
            cwd: coreApiDir,
            shell: true,
            stdio: "ignore"
          });
        } catch (e) {
          writeLog(`Failed to spawn Python backend: ${String(e)}`, true);
        }
      }
    }
    attempts++;
    await new Promise((r) => setTimeout(r, 1e3));
  }
  return false;
}
function createWindow() {
  writeLog("Electron Started");
  mainWindow = new electron.BrowserWindow({
    width: 960,
    height: 640,
    title: "ULTRON",
    backgroundColor: "#000000",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
electron.app.whenReady().then(async () => {
  createWindow();
  startBackendAndPoll();
  electron.ipcMain.handle("check-health", async () => {
    try {
      const res = await checkBackendHealth();
      return res;
    } catch (e) {
      return { status: "offline", error: String(e) };
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
