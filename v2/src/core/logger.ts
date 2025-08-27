
/**
 * @module core/logger
 * @description A simple logger utility.
 */

interface LogEntry {
  timestamp: Date;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];

  public log(message: string, data?: unknown): void {
    const entry: LogEntry = { timestamp: new Date(), message, data };
    this.logs.push(entry);
    console.log(`[${entry.timestamp.toISOString()}] ${message}`, data || '');
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }
}

const logger = new Logger();
export default logger;
