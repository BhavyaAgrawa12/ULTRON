import * as fs from 'node:fs';
import * as path from 'node:path';

export class Logger {
  private logFilePath: string;

  constructor(logsDir?: string) {
    const rootLogsDir = logsDir || path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(rootLogsDir)) {
      fs.mkdirSync(rootLogsDir, { recursive: true });
    }
    this.logFilePath = path.join(rootLogsDir, 'ultron.log');
  }

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [INFO] ${message}\n`;
    console.log(entry.trim());
    try {
      fs.appendFileSync(this.logFilePath, entry, 'utf-8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  public error(message: string, error?: unknown): void {
    const timestamp = new Date().toISOString();
    const errDetails = error ? ` - ${String(error)}` : '';
    const entry = `[${timestamp}] [ERROR] ${message}${errDetails}\n`;
    console.error(entry.trim());
    try {
      fs.appendFileSync(this.logFilePath, entry, 'utf-8');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
}

export const logger = new Logger();
