"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ultronAPI", {
  checkHealth: async () => {
    return await electron.ipcRenderer.invoke("check-health");
  },
  onLog: (callback) => {
    electron.ipcRenderer.on("app-log", (_event, message) => callback(message));
  }
});
