/// <reference types="vite/client" />

interface Window {
  ultronAPI?: {
    checkHealth: () => Promise<{ status: string; service?: string; error?: string }>;
    onLog: (callback: (logMessage: string) => void) => void;
  };
}
