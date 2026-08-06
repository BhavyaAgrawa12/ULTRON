import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ultronAPI', {
  checkHealth: async () => {
    return await ipcRenderer.invoke('check-health');
  },
  onLog: (callback: (logMessage: string) => void) => {
    ipcRenderer.on('app-log', (_event, message) => callback(message));
  },
});
